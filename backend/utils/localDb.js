const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '../data.json');

const initDb = async () => {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify({
      users: [],
      vehicles: require('./seedData.js') || [], // Initial vehicles
      bookings: []
    }, null, 2));
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
