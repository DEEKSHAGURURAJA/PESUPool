import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB || 'pesupool_nosql';

let client = null;
let isConnected = false;

// Fallback file storage for resilience
const FALLBACK_DIR = path.join(process.cwd(), 'data');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'nosql_store.json');

function ensureFallbackFile() {
  if (!fs.existsSync(FALLBACK_DIR)) {
    fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  }
  if (!fs.existsSync(FALLBACK_FILE)) {
    const defaultData = {
      ride_telemetry: [
        {
          telemetry_id: "TLM-101-01",
          ride_id: 1,
          driver_id: 1,
          timestamp: new Date().toISOString(),
          location: { type: "Point", coordinates: [77.5348, 12.9352] },
          speed_kmph: 45.2,
          heading: 140,
          current_segment: "Banashankari Ring Road",
          next_stop: "JP Nagar 6th Phase",
          estimated_delay_mins: 2,
          battery_fuel_level_pct: 82
        },
        {
          telemetry_id: "TLM-101-02",
          ride_id: 1,
          driver_id: 1,
          timestamp: new Date(Date.now() - 60000).toISOString(),
          location: { type: "Point", coordinates: [77.5671, 12.9174] },
          speed_kmph: 38.0,
          heading: 135,
          current_segment: "Silk Board Flyover Approach",
          next_stop: "Silk Board",
          estimated_delay_mins: 5,
          battery_fuel_level_pct: 80
        },
        {
          telemetry_id: "TLM-201-01",
          ride_id: 2,
          driver_id: 3,
          timestamp: new Date().toISOString(),
          location: { type: "Point", coordinates: [77.6229, 12.9172] },
          speed_kmph: 52.0,
          heading: 160,
          current_segment: "Electronic City Elevated Expressway",
          next_stop: "EC Campus Tech Gate",
          estimated_delay_mins: 0,
          battery_fuel_level_pct: 74
        }
      ],
      ride_chat_logs: [
        {
          chat_id: "MSG-001",
          ride_id: 1,
          sender_id: 2,
          sender_name: "Ananya Iyer",
          sender_role: "PASSENGER",
          message: "Hi Aarav! Standing at Banashankari Metro Pillar #42 near the ATM.",
          message_type: "TEXT",
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          chat_id: "MSG-002",
          ride_id: 1,
          sender_id: 1,
          sender_name: "Aarav Sharma",
          sender_role: "DRIVER",
          message: "Great! Driving the white i20 (KA-05-MQ-4192). Arriving in 3 minutes.",
          message_type: "TEXT",
          timestamp: new Date(Date.now() - 240000).toISOString()
        },
        {
          chat_id: "MSG-003",
          ride_id: 2,
          sender_id: 4,
          sender_name: "Priya Nair",
          sender_role: "PASSENGER",
          message: "Hi Rohan, will you be waiting at the Silk Board service road?",
          message_type: "TEXT",
          timestamp: new Date(Date.now() - 180000).toISOString()
        }
      ]
    };
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function readFallback() {
  ensureFallbackFile();
  try {
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { ride_telemetry: [], ride_chat_logs: [] };
  }
}

function writeFallback(data) {
  ensureFallbackFile();
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function getNoSQLDb() {
  if (client && isConnected) {
    return client.db(DB_NAME);
  }
  try {
    client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 1500 });
    await client.connect();
    isConnected = true;
    console.log('[PESUPool NoSQL] Connected to live MongoDB server.');
    return client.db(DB_NAME);
  } catch (err) {
    isConnected = false;
    return null;
  }
}

// ----------------------------------------------------------------------------
// TELEMETRY OPERATIONS
// ----------------------------------------------------------------------------
export async function insertTelemetry(telemetryDoc) {
  const db = await getNoSQLDb();
  if (db) {
    const col = db.collection('ride_telemetry');
    await col.insertOne(telemetryDoc);
    return telemetryDoc;
  }
  // Fallback
  const store = readFallback();
  if (!store.ride_telemetry) store.ride_telemetry = [];
  store.ride_telemetry.push(telemetryDoc);
  writeFallback(store);
  return telemetryDoc;
}

export async function getRideTelemetry(rideId) {
  const db = await getNoSQLDb();
  if (db) {
    const col = db.collection('ride_telemetry');
    return await col.find({ ride_id: Number(rideId) }).sort({ timestamp: -1 }).toArray();
  }
  const store = readFallback();
  return (store.ride_telemetry || [])
    .filter(t => t.ride_id === Number(rideId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ----------------------------------------------------------------------------
// CHAT OPERATIONS
// ----------------------------------------------------------------------------
export async function insertChatMessage(chatDoc) {
  const db = await getNoSQLDb();
  if (db) {
    const col = db.collection('ride_chat_logs');
    await col.insertOne(chatDoc);
    return chatDoc;
  }
  const store = readFallback();
  if (!store.ride_chat_logs) store.ride_chat_logs = [];
  store.ride_chat_logs.push(chatDoc);
  writeFallback(store);
  return chatDoc;
}

export async function getRideChatLogs(rideId) {
  const db = await getNoSQLDb();
  if (db) {
    const col = db.collection('ride_chat_logs');
    return await col.find({ ride_id: Number(rideId) }).sort({ timestamp: 1 }).toArray();
  }
  const store = readFallback();
  return (store.ride_chat_logs || [])
    .filter(c => c.ride_id === Number(rideId))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// ----------------------------------------------------------------------------
// NoSQL AGGREGATION PIPELINE (DBMS Level 3 Requirement)
// ----------------------------------------------------------------------------
export async function getNoSQLAggregatedMetrics() {
  const db = await getNoSQLDb();
  if (db) {
    const col = db.collection('ride_telemetry');
    // Aggregation pipeline: Group by current_segment to calculate average speed and ping frequency
    const segmentAgg = await col.aggregate([
      {
        $group: {
          _id: "$current_segment",
          avg_speed_kmph: { $avg: "$speed_kmph" },
          ping_count: { $sum: 1 },
          last_reported: { $max: "$timestamp" },
          avg_delay_mins: { $avg: "$estimated_delay_mins" }
        }
      },
      { $sort: { ping_count: -1 } }
    ]).toArray();

    return segmentAgg;
  }

  // Fallback in-memory aggregation pipeline simulation
  const store = readFallback();
  const telemetry = store.ride_telemetry || [];
  
  const map = {};
  telemetry.forEach(t => {
    const seg = t.current_segment || 'Campus Link Road';
    if (!map[seg]) {
      map[seg] = {
        _id: seg,
        total_speed: 0,
        ping_count: 0,
        last_reported: t.timestamp,
        total_delay: 0
      };
    }
    map[seg].total_speed += (t.speed_kmph || 0);
    map[seg].total_delay += (t.estimated_delay_mins || 0);
    map[seg].ping_count += 1;
    if (new Date(t.timestamp) > new Date(map[seg].last_reported)) {
      map[seg].last_reported = t.timestamp;
    }
  });

  return Object.values(map).map(m => ({
    _id: m._id,
    avg_speed_kmph: Math.round((m.total_speed / m.ping_count) * 10) / 10,
    ping_count: m.ping_count,
    last_reported: m.last_reported,
    avg_delay_mins: Math.round((m.total_delay / m.ping_count) * 10) / 10
  })).sort((a, b) => b.ping_count - a.ping_count);
}
