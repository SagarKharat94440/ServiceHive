import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('slotswapper');

  cachedClient = client;
  cachedDb = db;

  console.log('✅ Connected to MongoDB');
  return { client, db };
}
