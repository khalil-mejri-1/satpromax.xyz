import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Vetrine } from './models/Vetrine.js';
import { SiteContent } from './models/SiteContent.js';
import { LiveCategory } from './models/LiveCategory.js';
import { LiveChannel } from './models/LiveChannel.js';
import { syncChannelsData } from './scripts/syncNetflyChannels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// MongoDB Connection URI
const MONGO_URI =
  process.env.MONGODB_URI

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB Atlas (Serverless cached connection for Vercel)
let isConnected = false;
let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME || 'vetrine',
      serverSelectionTimeoutMS: 5000,
    }).then((conn) => {
      isConnected = true;
      console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
      return conn;
    }).catch((error) => {
      cachedPromise = null;
      isConnected = false;
      console.error('❌ MongoDB Connection Error:', error.message);
      throw error;
    });
  }
  await cachedPromise;
};

// Middleware to ensure database connection before processing API requests on Vercel
app.use(async (req, res, next) => {
  if (MONGO_URI && mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      // Continue and let individual route error handlers manage failure if any
    }
  }
  next();
});

connectDB();

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

// 1. Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World from IPPLAY TV Backend!',
    database: isConnected ? 'Connected to MongoDB Atlas (vetrine)' : 'Connecting / Offline',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
});

// 2. Get All Documents from "vetrine" Table/Collection
app.get('/api/vetrine', async (req, res) => {
  try {
    if (!isConnected) {
      return res.status(503).json({ error: 'Database not connected yet' });
    }
    const data = await Vetrine.find().sort({ createdAt: -1 });
    res.json({
      status: 'success',
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Create a New Document / Subscription Order in "vetrine"
app.post('/api/vetrine', async (req, res) => {
  try {
    const { plan, package: pkg, price, customerEmail, customerWhatsapp, deviceType, paymentMethod, notes } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'customerEmail is required' });
    }

    const newRecord = new Vetrine({
      plan: plan || pkg || '12 Months Plan',
      price: price || '$59.99',
      customerEmail: customerEmail.trim(),
      customerWhatsapp: customerWhatsapp ? customerWhatsapp.trim() : '',
      deviceType: deviceType || 'FireStick',
      paymentMethod: paymentMethod || 'card',
      status: 'pending',
      notes,
    });

    const savedRecord = await newRecord.save();

    res.status(201).json({
      message: 'Record successfully added to vetrine table!',
      status: 'success',
      data: savedRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete Record by ID from "vetrine"
app.delete('/api/vetrine/:id', async (req, res) => {
  try {
    const deleted = await Vetrine.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully', status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4.1 Update Order (Status, Notes, etc.) in "vetrine"
app.patch('/api/vetrine/:id', async (req, res) => {
  try {
    const { status, notes, plan, price, customerEmail, customerWhatsapp, deviceType, paymentMethod } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (plan !== undefined) updateData.plan = plan;
    if (price !== undefined) updateData.price = price;
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
    if (customerWhatsapp !== undefined) updateData.customerWhatsapp = customerWhatsapp;
    if (deviceType !== undefined) updateData.deviceType = deviceType;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;

    const updated = await Vetrine.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Order updated successfully', status: 'success', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get Site Content from MongoDB Atlas
app.get('/api/content', async (req, res) => {
  try {
    if (!isConnected) {
      return res.status(503).json({ error: 'Database not connected yet', data: null });
    }
    const doc = await SiteContent.findOne({ key: 'main_site_content' });
    res.json({
      status: 'success',
      data: doc ? doc.content : null,
      updatedAt: doc ? doc.updatedAt : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
});

// 6. Save / Update Site Content in MongoDB Atlas
app.post('/api/content', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content object is required' });
    }

    if (!isConnected) {
      return res.status(503).json({
        error: 'Database offline, content saved locally in client',
        savedLocally: true
      });
    }

    const updated = await SiteContent.findOneAndUpdate(
      { key: 'main_site_content' },
      { content, lastUpdatedBy: 'admin@gmail.com' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      message: 'Content successfully saved to MongoDB Atlas!',
      status: 'success',
      data: updated.content,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper to get local fallback cache
function getLocalCache() {
  try {
    const p = path.join(__dirname, 'data/channels_cache.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (e) {}
  return null;
}

// ----------------------------------------------------
// Live TV Channels & Categories API (Netfly Integration)
// ----------------------------------------------------

// 7. Get All Live Categories
app.get('/api/live-channels/categories', async (req, res) => {
  try {
    if (!isConnected) {
      const cache = getLocalCache();
      if (cache && cache.categories) {
        return res.json({ status: 'success', source: 'cache', count: cache.categories.length, data: cache.categories });
      }
    }
    const categories = await LiveCategory.find({ isActive: true }).sort({ index: 1, name: 1 });
    res.json({ status: 'success', count: categories.length, data: categories });
  } catch (err) {
    const cache = getLocalCache();
    if (cache && cache.categories) {
      return res.json({ status: 'success', source: 'cache', count: cache.categories.length, data: cache.categories });
    }
    res.status(500).json({ error: err.message });
  }
});

// 8. Get Live Channels (Supports category_id, search query, and pagination or full list)
app.get('/api/live-channels', async (req, res) => {
  try {
    const { category_id, search, limit = 0, page = 1 } = req.query;

    if (!isConnected) {
      const cache = getLocalCache();
      if (cache && cache.channels) {
        let list = cache.channels || [];
        if (category_id && category_id !== 'all') {
          list = list.filter((c) => String(c.category_id) === String(category_id));
        }
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          list = list.filter((c) => (c.name || '').toLowerCase().includes(q));
        }
        return res.json({
          status: 'success',
          source: 'cache',
          total: list.length,
          count: list.length,
          data: list,
        });
      }
    }

    const query = { isActive: true };
    if (category_id && category_id !== 'all') {
      query.category_id = Number(category_id);
    }
    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const total = await LiveChannel.countDocuments(query);
    let channelsQuery = LiveChannel.find(query).sort({ index: 1, name: 1 });

    const numLimit = parseInt(limit, 10);
    const numPage = parseInt(page, 10) || 1;

    if (numLimit > 0) {
      channelsQuery = channelsQuery.skip((numPage - 1) * numLimit).limit(numLimit);
    }

    const data = await channelsQuery.lean().exec();
    res.json({
      status: 'success',
      total,
      count: data.length,
      page: numLimit > 0 ? numPage : 1,
      totalPages: numLimit > 0 ? Math.ceil(total / numLimit) : 1,
      data,
    });
  } catch (err) {
    const cache = getLocalCache();
    if (cache && cache.channels) {
      let list = cache.channels || [];
      return res.json({ status: 'success', source: 'cache', total: list.length, data: list });
    }
    res.status(500).json({ error: err.message });
  }
});

// 9. Sync Live Channels and Categories Directly from Netfly
app.post('/api/live-channels/sync', async (req, res) => {
  try {
    const result = await syncChannelsData();
    res.json({
      status: 'success',
      message: 'Channels & categories successfully synced from Netfly!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Category CRUD (Admin management)
app.post('/api/live-channels/category', async (req, res) => {
  try {
    const { name, logoUrl, index } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    // Generate unique category_id
    const highestCat = await LiveCategory.findOne().sort({ category_id: -1 });
    const nextId = highestCat ? highestCat.category_id + 1 : 9001;

    const newCat = new LiveCategory({
      category_id: nextId,
      name: name.trim(),
      logoUrl: logoUrl || '',
      index: index !== undefined ? Number(index) : 999,
      program_total: 0,
      isActive: true,
    });

    const saved = await newCat.save();
    res.status(201).json({ status: 'success', data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/live-channels/category/:id', async (req, res) => {
  try {
    const { name, logoUrl, index, isActive } = req.body;
    const cat = await LiveCategory.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });

    if (name !== undefined) cat.name = name.trim();
    if (logoUrl !== undefined) cat.logoUrl = logoUrl;
    if (index !== undefined) cat.index = Number(index);
    if (isActive !== undefined) cat.isActive = Boolean(isActive);

    await cat.save();

    // If name changed, update category_name in channels
    if (name) {
      await LiveChannel.updateMany({ category_id: cat.category_id }, { category_name: cat.name });
    }

    res.json({ status: 'success', data: cat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/live-channels/category/:id', async (req, res) => {
  try {
    const cat = await LiveCategory.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });

    // Delete category
    await LiveCategory.findByIdAndDelete(req.params.id);
    // Delete channels associated with this category
    await LiveChannel.deleteMany({ category_id: cat.category_id });

    res.json({ status: 'success', message: 'Category and its channels deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Channel CRUD (Admin management)
app.post('/api/live-channels/channel', async (req, res) => {
  try {
    const { name, logo, category_id, is_premium, is_adult, index } = req.body;
    if (!name || !category_id) {
      return res.status(400).json({ error: 'Channel name and category_id are required' });
    }

    const cat = await LiveCategory.findOne({ category_id: Number(category_id) });

    const highestChan = await LiveChannel.findOne().sort({ channel_id: -1 });
    const nextId = highestChan ? highestChan.channel_id + 1 : 90001;

    const newChan = new LiveChannel({
      channel_id: nextId,
      name: name.trim(),
      logo: logo || '',
      category_id: Number(category_id),
      category_name: cat ? cat.name : 'General',
      is_premium: is_premium ? 1 : 0,
      is_adult: is_adult ? 1 : 0,
      index: index !== undefined ? Number(index) : 999,
      isActive: true,
    });

    const saved = await newChan.save();

    // Update program_total on category
    if (cat) {
      cat.program_total = (cat.program_total || 0) + 1;
      await cat.save();
    }

    res.status(201).json({ status: 'success', data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/live-channels/channel/:id', async (req, res) => {
  try {
    const { name, logo, category_id, is_premium, is_adult, index, isActive } = req.body;
    const chan = await LiveChannel.findById(req.params.id);
    if (!chan) return res.status(404).json({ error: 'Channel not found' });

    if (name !== undefined) chan.name = name.trim();
    if (logo !== undefined) chan.logo = logo;
    if (is_premium !== undefined) chan.is_premium = is_premium ? 1 : 0;
    if (is_adult !== undefined) chan.is_adult = is_adult ? 1 : 0;
    if (index !== undefined) chan.index = Number(index);
    if (isActive !== undefined) chan.isActive = Boolean(isActive);

    if (category_id !== undefined && Number(category_id) !== chan.category_id) {
      const oldCatId = chan.category_id;
      const newCat = await LiveCategory.findOne({ category_id: Number(category_id) });
      chan.category_id = Number(category_id);
      chan.category_name = newCat ? newCat.name : chan.category_name;

      // Update counts
      await LiveCategory.updateOne({ category_id: oldCatId }, { $inc: { program_total: -1 } });
      if (newCat) {
        await LiveCategory.updateOne({ category_id: newCat.category_id }, { $inc: { program_total: 1 } });
      }
    }

    await chan.save();
    res.json({ status: 'success', data: chan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/live-channels/channel/:id', async (req, res) => {
  try {
    const chan = await LiveChannel.findById(req.params.id);
    if (!chan) return res.status(404).json({ error: 'Channel not found' });

    await LiveChannel.findByIdAndDelete(req.params.id);
    // Decrement category count
    await LiveCategory.updateOne({ category_id: chan.category_id }, { $inc: { program_total: -1 } });

    res.json({ status: 'success', message: 'Channel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server locally (Vercel manages execution in serverless mode)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('==============================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 Local: http://127.0.0.1:${PORT}`);
    console.log('==============================================');
  });
}

export default app;
