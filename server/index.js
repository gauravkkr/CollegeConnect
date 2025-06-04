const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/college-connect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Get all messages
app.get('/api/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Add a new message
app.post('/api/messages', async (req, res) => {
  const { text } = req.body;
  const newMsg = new Message({ text });
  await newMsg.save();
  res.json(newMsg);
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  // In production, hash the password!
  const user = new User({ username, password });
  await user.save();
  res.json({ message: 'User created' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));