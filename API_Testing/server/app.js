// src/server/index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Simple in-memory storage
const users = new Map();

// Middleware for basic validation
const validateProfileData = (req, res, next) => {
  const { name, age, gender, location, interests } = req.body;

  if (!name || !age || !gender || !location || !interests) {
    return res.status(400).json({
      error: 'Missing required fields',
    });
  }

  if (age < 18) {
    return res.status(400).json({
      error: 'Must be 18 or older',
    });
  }

  next();
};

// Profile creation endpoint
app.post('/profile', validateProfileData, (req, res) => {
  const { email, password, ...profileData } = req.body;

  if (users.has(email)) {
    return res.status(409).json({
      error: 'User already exists',
    });
  }

  // Store user data
  users.set(email, {
    ...profileData,
    password,
    id: Date.now().toString(),
  });

  res.status(201).json({
    message: 'Profile created successfully',
    userId: users.get(email).id,
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  const user = users.get(email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      error: 'Invalid credentials',
    });
  }

  res.json({
    message: 'Login successful',
    userId: user.id,
  });
});

// Only start the server if not in a testing environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export for testing
