const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

//edited to use both my own cluster for database or local hsoted database if needed.

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aethera_airways';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('Users', userSchema, 'Users');

app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    await User.create({ name: name.trim(), email: normalizedEmail, password });
    res.status(201).json({ success: true, message: 'Account created successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail, password });

    if (user) {
      res.json({ success: true, name: user.name, userId: user._id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const flightSchema = new mongoose.Schema({
  id: Number,
  flightNumber: String,
  origin: String,
  originName: String,
  destination: String,
  destinationName: String,
  departureTime: String,
  arrivalTime: String,
  duration: Number,
  aircraft: String,
  seats: Object
});

const Flight = mongoose.model('Flights', flightSchema, 'Flights');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flights' },
  passengers: Array,
  seatsBooked: Object,
  totalAmount: Number,
  confirmationNumber: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Bookings', bookingSchema, 'Bookings');

app.get('/flights', async (req, res) => {
  const { origin, destination, date } = req.query;

  try {
    const flights = await Flight.find({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase()
    });

    const filteredFlights = flights.filter(flight => {
      const flightDate = flight.departureTime.split('T')[0];
      const includesHub = flight.origin === 'ORD' || flight.destination === 'ORD';
      return flightDate === date && includesHub;
    });

    res.json({ success: true, flights: filteredFlights });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/flights/:id', async (req, res) => {
  const flightId = Number(req.params.id);

  if (!Number.isInteger(flightId)) {
    return res.status(400).json({ success: false, message: 'Invalid flight id' });
  }

  try {
    const flight = await Flight.findOne({ id: flightId });

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const includesHub = flight.origin === 'ORD' || flight.destination === 'ORD';

    if (!includesHub) {
      return res.status(400).json({ success: false, message: 'Flight must include ORD' });
    }

    res.json({ success: true, flight });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/bookings/confirmation/:confirmationNumber', async (req, res) => {
  const confirmationNumber = req.params.confirmationNumber?.trim().toUpperCase();
  const lastName = req.query.lastName?.trim().toLowerCase();

  if (!confirmationNumber || !lastName) {
    return res.status(400).json({ success: false, message: 'Confirmation number and last name are required' });
  }

  try {
    const booking = await Booking.findOne({ confirmationNumber }).lean();

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const passengerMatches = booking.passengers?.some((passenger) => {
      return passenger.lastName?.trim().toLowerCase() === lastName;
    });

    if (!passengerMatches) {
      return res.status(404).json({ success: false, message: 'Booking not found for that last name' });
    }

    const flight = await Flight.findOne({ _id: booking.flightId }).lean()
      || await Flight.findOne({ id: booking.flightId }).lean();

    res.json({ success: true, booking, flight });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const makeConfirmationNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};

app.post('/bookings', async (req, res) => {
  const { userId, flightId, passengers, seatsBooked } = req.body;

  if (!userId || !flightId || !passengers || !seatsBooked) {
    return res.status(400).json({ success: false, message: 'Missing booking information' });
  }

  try {
    const flight = await Flight.findOne({ id: Number(flightId) });

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const seatClasses = ['economy', 'premiumEconomy', 'firstClass'];

    for (const seatClass of seatClasses) {
      const count = Number(seatsBooked[seatClass]) || 0;

      if (count > flight.seats[seatClass].available) {
        return res.status(400).json({ success: false, message: 'Not enough seats available' });
      }
    }

    let totalAmount = 0;

    for (const seatClass of seatClasses) {
      const count = Number(seatsBooked[seatClass]) || 0;
      totalAmount += count * flight.seats[seatClass].price;
      flight.seats[seatClass].available -= count;
    }

    let confirmationNumber = makeConfirmationNumber();

    while (await Booking.findOne({ confirmationNumber })) {
      confirmationNumber = makeConfirmationNumber();
    }

    flight.markModified('seats');
    await flight.save();

    const booking = await Booking.create({
      userId,
      flightId: flight._id,
      passengers,
      seatsBooked,
      totalAmount,
      confirmationNumber
    });

    res.status(201).json({ success: true, booking });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
