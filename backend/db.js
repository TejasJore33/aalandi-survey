// db.js

const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017'); // Use your MongoDB URI

let db;

const connectToDB = async () => {
  if (db) return db; // If already connected, return the existing connection

  try {
    await client.connect();
    db = client.db('propertyForms'); // Database name
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectToDB;
