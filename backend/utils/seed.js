const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const cars = [
  { brand: 'Hyundai', model: 'Creta', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '16 kmpl', seatingCapacity: 5, pricePerDay: 2500, description: 'Comfortable compact SUV.' },
  { brand: 'Hyundai', model: 'Verna', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 2200, description: 'Premium sedan with great features.' },
  { brand: 'Maruti', model: 'Baleno', year: 2022, type: 'Car', fuelType: 'Petrol', transmission: 'Manual', mileage: '22 kmpl', seatingCapacity: 5, pricePerDay: 1500, description: 'Spacious premium hatchback.' },
  { brand: 'Maruti', model: 'Brezza', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '19 kmpl', seatingCapacity: 5, pricePerDay: 1800, description: 'Reliable compact SUV.' },
  { brand: 'Tata', model: 'Nexon', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Manual', mileage: '17 kmpl', seatingCapacity: 5, pricePerDay: 2000, description: 'Safe and sturdy compact SUV.' },
  { brand: 'Tata', model: 'Harrier', year: 2023, type: 'Car', fuelType: 'Diesel', transmission: 'Automatic', mileage: '15 kmpl', seatingCapacity: 5, pricePerDay: 3500, description: 'Bold and powerful SUV.' },
  { brand: 'Mahindra', model: 'XUV700', year: 2023, type: 'Car', fuelType: 'Diesel', transmission: 'Automatic', mileage: '14 kmpl', seatingCapacity: 7, pricePerDay: 4000, description: 'Feature-rich 7-seater SUV.' },
  { brand: 'Mahindra', model: 'Thar', year: 2023, type: 'Car', fuelType: 'Diesel', transmission: 'Manual', mileage: '15 kmpl', seatingCapacity: 4, pricePerDay: 3500, description: 'Iconic off-roader.' },
  { brand: 'Kia', model: 'Seltos', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '16 kmpl', seatingCapacity: 5, pricePerDay: 2600, description: 'Stylish and modern SUV.' },
  { brand: 'Kia', model: 'Sonet', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Manual', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 1900, description: 'Compact and dynamic SUV.' },
  { brand: 'Honda', model: 'City', year: 2022, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '17 kmpl', seatingCapacity: 5, pricePerDay: 2400, description: 'Classic comfortable sedan.' },
  { brand: 'Toyota', model: 'Innova Crysta', year: 2023, type: 'Car', fuelType: 'Diesel', transmission: 'Manual', mileage: '13 kmpl', seatingCapacity: 7, pricePerDay: 4500, description: 'The ultimate family MPV.' },
  { brand: 'Toyota', model: 'Fortuner', year: 2023, type: 'Car', fuelType: 'Diesel', transmission: 'Automatic', mileage: '10 kmpl', seatingCapacity: 7, pricePerDay: 6000, description: 'Rugged and premium full-size SUV.' },
  { brand: 'MG', model: 'Hector', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '14 kmpl', seatingCapacity: 5, pricePerDay: 3000, description: 'Internet inside SUV.' },
  { brand: 'Volkswagen', model: 'Virtus', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 2700, description: 'German engineered premium sedan.' },
  { brand: 'Skoda', model: 'Slavia', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 2700, description: 'Elegant and powerful sedan.' },
  { brand: 'Renault', model: 'Kiger', year: 2022, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '19 kmpl', seatingCapacity: 5, pricePerDay: 1700, description: 'Affordable compact SUV.' },
  { brand: 'Nissan', model: 'Magnite', year: 2022, type: 'Car', fuelType: 'Petrol', transmission: 'Manual', mileage: '20 kmpl', seatingCapacity: 5, pricePerDay: 1600, description: 'Value for money compact SUV.' },
  { brand: 'Jeep', model: 'Compass', year: 2023, type: 'Car', fuelType: 'Diesel', transmission: 'Automatic', mileage: '15 kmpl', seatingCapacity: 5, pricePerDay: 4000, description: 'Premium compact SUV with 4x4.' },
  { brand: 'BMW', model: '3 Series', year: 2023, type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', mileage: '14 kmpl', seatingCapacity: 5, pricePerDay: 10000, description: 'Luxury sports sedan.' }
].map(c => ({...c, images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800']}));

const bikes = [
  { brand: 'Royal Enfield', model: 'Classic 350', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 800, description: 'Iconic retro cruiser.' },
  { brand: 'Royal Enfield', model: 'Hunter 350', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '36 kmpl', seatingCapacity: 2, pricePerDay: 750, description: 'Agile city roadster.' },
  { brand: 'Royal Enfield', model: 'Meteor 350', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 850, description: 'Perfect highway cruiser.' },
  { brand: 'KTM', model: 'Duke 200', year: 2022, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '33 kmpl', seatingCapacity: 2, pricePerDay: 900, description: 'Lightweight street fighter.' },
  { brand: 'KTM', model: 'Duke 390', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '28 kmpl', seatingCapacity: 2, pricePerDay: 1500, description: 'Aggressive and powerful naked bike.' },
  { brand: 'Yamaha', model: 'R15 V4', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 1000, description: 'Sporty track-oriented machine.' },
  { brand: 'Yamaha', model: 'MT15', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 950, description: 'Dark warrior street fighter.' },
  { brand: 'Bajaj', model: 'Pulsar NS200', year: 2022, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 700, description: 'Performance naked street bike.' },
  { brand: 'Bajaj', model: 'Dominar 400', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '27 kmpl', seatingCapacity: 2, pricePerDay: 1200, description: 'Power cruiser for touring.' },
  { brand: 'TVS', model: 'Apache RTR 200', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '38 kmpl', seatingCapacity: 2, pricePerDay: 800, description: 'Race-tuned street bike.' },
  { brand: 'TVS', model: 'Ronin', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '40 kmpl', seatingCapacity: 2, pricePerDay: 750, description: 'Modern retro scrambler.' },
  { brand: 'Honda', model: 'CB350', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 850, description: 'Refined classic cruiser.' },
  { brand: 'Honda', model: 'Hornet 2.0', year: 2022, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 600, description: 'Aggressive street commuter.' },
  { brand: 'Suzuki', model: 'Gixxer SF', year: 2022, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 700, description: 'Fully faired sports commuter.' },
  { brand: 'Hero', model: 'Xpulse 200', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '40 kmpl', seatingCapacity: 2, pricePerDay: 650, description: 'Go-anywhere adventure bike.' },
  { brand: 'Hero', model: 'Karizma XMR', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 900, description: 'Legendary sports bike reborn.' },
  { brand: 'Jawa', model: '42', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '33 kmpl', seatingCapacity: 2, pricePerDay: 850, description: 'Classic twin exhaust bobber style.' },
  { brand: 'Yezdi', model: 'Roadster', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '30 kmpl', seatingCapacity: 2, pricePerDay: 900, description: 'Neo-retro roadster.' },
  { brand: 'Kawasaki', model: 'Ninja 300', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '25 kmpl', seatingCapacity: 2, pricePerDay: 2500, description: 'Twin-cylinder sports bike.' },
  { brand: 'BMW', model: 'G310R', year: 2023, type: 'Bike', fuelType: 'Petrol', transmission: 'Manual', mileage: '30 kmpl', seatingCapacity: 2, pricePerDay: 2000, description: 'Premium entry-level roadster.' }
].map(b => ({...b, images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800']}));

const vehicles = [...cars, ...bikes];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-rental-app');

    await Vehicle.deleteMany();
    console.log('Vehicles destroyed...');

    await Vehicle.insertMany(vehicles);
    console.log('Vehicles imported!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
