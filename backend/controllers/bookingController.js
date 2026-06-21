const Booking = require('../models/Booking');
const { readDb } = require('../utils/localDb');

exports.createBooking = async (req, res) => {
  try {
    const { 
      vehicleId, name, phone, aadhar, pickupAddress, dropAddress, 
      pickupDate, returnDate, rentalAmount, securityDeposit, gstAmount, totalAmount 
    } = req.body;

    // Overlap check in MongoDB
    const existingBooking = await Booking.findOne({
      vehicle: vehicleId,
      bookingStatus: 'Active',
      pickupDate: { $lte: new Date(returnDate) },
      returnDate: { $gte: new Date(pickupDate) }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Vehicle is not available for the selected dates' });
    }

    const booking = new Booking({
      user: req.user._id,
      vehicle: vehicleId,
      name, phone, aadhar, pickupAddress, dropAddress,
      pickupDate, returnDate, rentalAmount, securityDeposit, gstAmount, totalAmount
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const myBookings = await Booking.find({ user: req.user._id }).lean();
    const db = await readDb(); // Fallback to populate localDb vehicles

    const populated = myBookings.map(b => ({
      ...b,
      vehicle: db.vehicles.find(v => v._id === b.vehicle)
    }));
    res.json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).lean();
    const db = await readDb(); // Fallback to populate localDb users and vehicles

    const populated = bookings.map(b => ({
      ...b,
      user: db.users.find(u => u._id === b.user),
      vehicle: db.vehicles.find(v => v._id === b.vehicle)
    }));
    res.json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
