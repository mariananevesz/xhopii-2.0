import { MongoClient } from 'mongodb';
let client;
let db;

async function connectDatabase() {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db(process.env.MONGO_DB);
    console.log('MongoDB conectado com sucesso!');
}

function getDatabase() {
    return db;
}

export {
    connectDatabase,
    getDatabase
};