// MongoDB Client helper
// Provides safe fallback for build-time typechecking when driver is loaded remotely on Netlify

let clientPromise: Promise<any> | null = null;

const uri = process.env.MONGODB_URI;

if (uri) {
  try {
    // Dynamic import to avoid missing module errors in local environments without npm install mongodb
    const { MongoClient } = require('mongodb');
    const options = {};

    if (process.env.NODE_ENV === 'development') {
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<any>;
      };

      if (!globalWithMongo._mongoClientPromise) {
        const client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
      }
      clientPromise = globalWithMongo._mongoClientPromise || null;
    } else {
      const client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  } catch (err) {
    // MongoDB driver will be bundled by Netlify builder
    clientPromise = null;
  }
}

export async function getDatabase(dbName = 'mbn_news') {
  if (!clientPromise) {
    return null;
  }
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (e) {
    return null;
  }
}

export default clientPromise;
