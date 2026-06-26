const crypto = require('crypto');
const { readDb, writeDb } = require('../utils/localDb');

exports.createBooking = async (req, res) => {
  try {
    const { 
      vehicleId, name, phone, aadhar, pickupAddress, dropAddress, 
      pickupDate, returnDate, rentalAmount, securityDeposit, gstAmount, totalAmount 
    } = req.body;

    const db = await readDb();

    // Overlap check in localDb
    const existingBooking = db.bookings.find(b => 
      b.vehicle === vehicleId &&
      b.bookingStatus === 'Active' &&
      new Date(b.pickupDate) <= new Date(returnDate) &&
      new Date(b.returnDate) >= new Date(pickupDate)
    );

    if (existingBooking) {
      return res.status(400).json({ message: 'Vehicle is not available for the selected dates' });
    }

    const newBooking = {
      _id: crypto.randomUUID(),
      user: req.user._id,
      vehicle: vehicleId,
      name, phone, aadhar, pickupAddress, dropAddress,
      pickupDate, returnDate, rentalAmount, securityDeposit, gstAmount, totalAmount,
      bookingStatus: 'Active',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    await writeDb(db);

    res.status(201).json(newBooking);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const db = await readDb();
    const myBookings = db.bookings.filter(b => b.user === req.user._id);

    const populated = myBookings.map(b => ({
      ...b,
      vehicle: db.vehicles.find(v => v._id === b.vehicle)
    }));
    res.json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getBookings = async (req, res) => {
  try {
    const db = await readDb();
    const bookings = db.bookings;

    const populated = bookings.map(b => ({
      ...b,
      user: db.users.find(u => u._id === b.user),
      vehicle: db.vehicles.find(v => v._id === b.vehicle)
    }));
    res.json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
