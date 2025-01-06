// src/tests/api.test.js
const request = require('supertest');
const app = require('../server/app.js');

describe('Matchify API Tests', () => {
  const validProfile = {
    email: 'server@gmail.com',
    password: 'password123',
    name: 'Plan Test',
    age: 25,
    gender: 'male',
    location: 'Lagos',
    interests: ['hiking', 'reading'],
  };

  describe('POST /profile', () => {
    it('should create a new profile with valid data', async () => {
      const response = await request(app).post('/profile').send(validProfile);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Profile created successfully'
      );
      expect(response.body).toHaveProperty('userId');
    });

    it('should reject profile creation with missing fields', async () => {
      const invalidProfile = { ...validProfile };
      delete invalidProfile.name;

      const response = await request(app).post('/profile').send(invalidProfile);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required fields');
    });

    it('should reject underage users', async () => {
      const underageProfile = {
        ...validProfile,
        age: 16,
      };

      const response = await request(app)
        .post('/profile')
        .send(underageProfile);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Must be 18 or older');
    });

    it('should prevent duplicate email registration', async () => {
      // First registration
      await request(app).post('/profile').send(validProfile);

      // Duplicate registration attempt
      const response = await request(app).post('/profile').send(validProfile);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'User already exists');
    });
  });

  describe('POST /login', () => {
    beforeAll(async () => {
      // Create a test user
      await request(app).post('/profile').send(validProfile);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app).post('/login').send({
        email: validProfile.email,
        password: validProfile.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('userId');
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app).post('/login').send({
        email: validProfile.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app).post('/login').send({
        email: validProfile.email,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'Email and password are required'
      );
    });
  });
});
