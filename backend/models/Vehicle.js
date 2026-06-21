const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Car', 'Bike'],
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  transmission: {
    type: String,
    required: true
  },
  mileage: {
    type: String,
    required: true
  },
  seatingCapacity: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Booked', 'Maintenance'],
    default: 'Available'
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
