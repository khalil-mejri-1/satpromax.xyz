import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LiveCategory } from '../models/LiveCategory.js';
import { LiveChannel } from '../models/LiveChannel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'vetrine';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
      res.on('error', reject);
    });
  });
}

export async function syncChannelsData() {
  console.log('🚀 Starting Netfly channels & categories sync...');

  // 1. Fetch from Netfly
  console.log('📡 Fetching categories from Netfly...');
  const catRes = await fetchJson('https://netflyapp.com/api/live/categories');
  const rawCategories = catRes?.data || [];
  console.log(`✅ Fetched ${rawCategories.length} categories.`);

  console.log('📡 Fetching channels from Netfly...');
  const chanRes = await fetchJson('https://netflyapp.com/api/live/channels');
  const rawChannels = chanRes?.data || [];
  console.log(`✅ Fetched ${rawChannels.length} channels.`);

  // Create category ID to name lookup map
  const catMap = new Map();
  rawCategories.forEach((cat) => {
    catMap.set(cat.category_id, cat.name);
  });

  // Prepare categories for DB
  const categoriesToSave = rawCategories.map((cat, idx) => ({
    category_id: Number(cat.category_id),
    name: cat.name || 'Unknown',
    logoUrl: cat.logoUrl || '',
    program_total: Number(cat.program_total) || 0,
    index: typeof cat.index === 'number' ? cat.index : idx + 1,
    is_premium: Number(cat.is_premium) || 0,
    is_adult: Number(cat.is_adult) || 0,
    isActive: true,
  }));

  // Prepare channels for DB
  const channelsToSave = rawChannels.map((ch, idx) => ({
    channel_id: Number(ch.id),
    name: ch.name || 'Channel',
    logo: ch.logo || '',
    category_id: Number(ch.category_id),
    category_name: catMap.get(Number(ch.category_id)) || ch.category_property || 'Other',
    category_property: ch.category_property || '',
    is_premium: Number(ch.is_premium) || 0,
    is_adult: Number(ch.is_adult) || 0,
    index: typeof ch.index === 'number' ? ch.index : idx + 1,
    isActive: true,
  }));

  // 2. Save local fallback cache file
  try {
    const serverDataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(serverDataDir)) fs.mkdirSync(serverDataDir, { recursive: true });
    
    const clientDataDir = path.join(__dirname, '../../client/src/data');
    if (!fs.existsSync(clientDataDir)) fs.mkdirSync(clientDataDir, { recursive: true });

    const cachePayload = {
      updatedAt: new Date().toISOString(),
      categoriesCount: categoriesToSave.length,
      channelsCount: channelsToSave.length,
      categories: categoriesToSave,
      channels: channelsToSave,
    };

    fs.writeFileSync(path.join(serverDataDir, 'channels_cache.json'), JSON.stringify(cachePayload, null, 2));
    fs.writeFileSync(path.join(clientDataDir, 'channels_cache.json'), JSON.stringify(cachePayload));
    console.log('💾 Saved local fallback JSON files in server and client data directories.');
  } catch (fsErr) {
    console.warn('⚠️ Warning: could not write local cache file:', fsErr.message);
  }

  // 3. Save to MongoDB Atlas
  let isDbConnected = false;
  if (MONGO_URI) {
    try {
      console.log('🔌 Connecting to MongoDB Atlas...');
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(MONGO_URI, {
          dbName: DB_NAME,
          serverSelectionTimeoutMS: 10000,
        });
      }
      isDbConnected = true;
      console.log('✅ Connected to MongoDB Atlas.');

      console.log('🔄 Bulk upserting categories into MongoDB...');
      const catOps = categoriesToSave.map((cat) => ({
        updateOne: {
          filter: { category_id: cat.category_id },
          update: { $set: cat },
          upsert: true,
        },
      }));
      if (catOps.length > 0) {
        await LiveCategory.bulkWrite(catOps);
      }
      console.log(`✅ Successfully saved ${catOps.length} categories to database.`);

      console.log('🔄 Bulk upserting channels into MongoDB (in batches)...');
      const batchSize = 1000;
      for (let i = 0; i < channelsToSave.length; i += batchSize) {
        const batch = channelsToSave.slice(i, i + batchSize);
        const chanOps = batch.map((ch) => ({
          updateOne: {
            filter: { channel_id: ch.channel_id },
            update: { $set: ch },
            upsert: true,
          },
        }));
        await LiveChannel.bulkWrite(chanOps);
        console.log(`   Saved channels ${i + 1} to ${Math.min(i + batchSize, channelsToSave.length)}...`);
      }
      console.log(`🎉 Successfully saved all ${channelsToSave.length} channels to MongoDB Atlas!`);
    } catch (dbErr) {
      console.error('❌ Error saving to MongoDB:', dbErr.message);
    }
  } else {
    console.log('⚠️ No MONGO_URI configured in server/.env');
  }

  return {
    categoriesCount: categoriesToSave.length,
    channelsCount: channelsToSave.length,
    dbSaved: isDbConnected,
    timestamp: new Date().toISOString(),
  };
}

// Run immediately if called from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncChannelsData()
    .then((res) => {
      console.log('🏁 Sync complete:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Sync failed:', err);
      process.exit(1);
    });
}
