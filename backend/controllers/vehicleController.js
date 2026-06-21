const { readDb, writeDb } = require('../utils/localDb');
const crypto = require('crypto');

exports.getVehicles = async (req, res) => {
  try {
    const { type, brand, fuelType, transmission } = req.query;
    const db = await readDb();
    let vehicles = db.vehicles;
    
    if (type) vehicles = vehicles.filter(v => v.type === type);
    if (brand) vehicles = vehicles.filter(v => v.brand === brand);
    if (fuelType) vehicles = vehicles.filter(v => v.fuelType === fuelType);
    if (transmission) vehicles = vehicles.filter(v => v.transmission === transmission);

    res.json(vehicles);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getVehicleById = async (req, res) => {
  try {
    const db = await readDb();
    const vehicle = db.vehicles.find(v => v._id === req.params.id);
    if (vehicle) res.json(vehicle);
    else res.status(404).json({ message: 'Vehicle not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createVehicle = async (req, res) => {
  try {
    const db = await readDb();
    const newVehicle = { _id: crypto.randomUUID(), ...req.body };
    db.vehicles.push(newVehicle);
    await writeDb(db);
    res.status(201).json(newVehicle);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateVehicle = async (req, res) => {
  try {
    const db = await readDb();
    const index = db.vehicles.findIndex(v => v._id === req.params.id);
    if (index !== -1) {
      db.vehicles[index] = { ...db.vehicles[index], ...req.body };
      await writeDb(db);
      res.json(db.vehicles[index]);
    } else { res.status(404).json({ message: 'Vehicle not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const db = await readDb();
    const index = db.vehicles.findIndex(v => v._id === req.params.id);
    if (index !== -1) {
      db.vehicles.splice(index, 1);
      await writeDb(db);
      res.json({ message: 'Vehicle removed' });
    } else { res.status(404).json({ message: 'Vehicle not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};
