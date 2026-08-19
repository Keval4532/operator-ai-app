import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE || 'operator_ai_db';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  if (!uri) {
    // Graceful fallback if MongoDB is not configured in env
    return { client: null, db: null };
  }

  if (client && db) {
    return { client, db };
  }

  try {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`[MongoDB] Connected successfully to isolated database: ${dbName}`);
    return { client, db };
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    return { client: null, db: null };
  }
}

export async function getDatabase(): Promise<Db | null> {
  const { db } = await connectToDatabase();
  return db;
}
