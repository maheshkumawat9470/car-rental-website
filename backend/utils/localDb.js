const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
const sourceDataFile = path.join(__dirname, '../data.json');
const dataFile = isProduction ? path.join(os.tmpdir(), 'data.json') : sourceDataFile;

const initDb = async () => {
  try {
    await fs.access(dataFile);
  } catch {
    // If running in production and /tmp/data.json doesn't exist, try to copy from source or initialize new
    let initialData = {
      users: [],
      vehicles: require('./seedData.js') || [],
      bookings: []
    };
    if (isProduction) {
      try {
        const sourceData = await fs.readFile(sourceDataFile, 'utf8');
        initialData = JSON.parse(sourceData);
      } catch (e) {
        // Source data doesn't exist or is invalid, use default initialData
      }
    }
    await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2));
  }
};

const readDb = async () => {
  const data = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(data);
};

const writeDb = async (data) => {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
};

module.exports = { initDb, readDb, writeDb };
