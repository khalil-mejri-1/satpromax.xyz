import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Vetrine } from './models/Vetrine.js';
import { SiteContent } from './models/SiteContent.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection URI
const MONGO_URI =
  process.env.MONGODB_URI

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME || 'vetrine',
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    console.log(`📂 Database / Table Name: vetrine`);
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('💡 Note: Make sure your IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).');
  }
};

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
    const { plan, price, customerEmail, customerWhatsapp, deviceType, paymentMethod, notes } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'customerEmail is required' });
    }

    const newRecord = new Vetrine({
      plan: plan || '12 Months Plan',
      price: price || '$59.99',
      customerEmail,
      customerWhatsapp,
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

// Start Express Server
app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('==============================================');
});
