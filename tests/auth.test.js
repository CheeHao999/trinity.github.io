const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/shared/utils/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock Prisma
jest.mock('../src/shared/utils/prismaClient', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  item: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
}));

describe('Auth Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 1,
        email: userData.email,
        password: 'hashedpassword',
        name: userData.name,
      });

      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', userData.email);
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
      };

      prisma.user.findUnique.mockResolvedValue({ id: 1, email: userData.email });

      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: loginData.email,
        password: hashedPassword,
        name: 'Test User',
      });

      const res = await request(app).post('/api/auth/login').send(loginData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: loginData.email,
        password: hashedPassword,
      });

      const res = await request(app).post('/api/auth/login').send(loginData);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});
