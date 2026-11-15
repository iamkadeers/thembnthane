import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve connection across HMR
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production (Netlify functions), create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDatabase(dbName = 'mbn_news'): Promise<Db | null> {
  if (!clientPromise) {
    return null;
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export default clientPromise;
