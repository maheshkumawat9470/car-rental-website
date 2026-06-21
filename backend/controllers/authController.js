const { readDb, writeDb } = require('../utils/localDb');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const db = await readDb();
    const userExists = db.users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = {
      _id: crypto.randomUUID(),
      name, email, password, phone, role: 'user', drivingLicenseStatus: 'Pending'
    };
    db.users.push(newUser);
    await writeDb(db);
    res.status(201).json({
      _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, token: generateToken(newUser._id)
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await readDb();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getUserProfile = async (req, res) => {
  try {
    const db = await readDb();
    const user = db.users.find(u => u._id === req.user._id);
    if (user) {
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};
