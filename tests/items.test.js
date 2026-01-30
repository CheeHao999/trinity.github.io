const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/shared/utils/prismaClient');
const jwt = require('jsonwebtoken');

// Mock Prisma
jest.mock('../src/shared/utils/prismaClient', () => ({
  item: {
    findMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  }
}));

// Mock Upload Middleware (to avoid actual file handling in tests)
jest.mock('../src/dashboard/uploadMiddleware', () => ({
  single: () => (req, res, next) => {
    req.file = { filename: 'test-image.jpg' };
    next();
  },
}));

describe('Item Endpoints', () => {
  let token;

  beforeAll(() => {
    // Generate a mock token
    token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/lost-items', () => {
    it('should fetch lost items', async () => {
      const mockItems = [
        {
          id: 1,
          name: 'Lost Phone',
          description: 'iPhone 12',
          location: 'Library',
          type: 'LOST',
          date: new Date(),
          userId: 1,
          createdAt: new Date(),
          status: 'OPEN',
          imageUrl: 'image.jpg'
        },
      ];

      prisma.item.findMany.mockResolvedValue(mockItems);

      const res = await request(app).get('/api/lost-items');

      expect(res.statusCode).toEqual(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].name).toBe('Lost Phone');
    });
  });

  describe('POST /api/lost-items', () => {
    it('should create a lost item', async () => {
      const newItem = {
        name: 'Lost Wallet',
        description: 'Black leather',
        location: 'Cafeteria',
        lostDate: new Date().toISOString(),
      };

      prisma.item.create.mockResolvedValue({
        id: 2,
        ...newItem,
        date: new Date(newItem.lostDate),
        type: 'LOST',
        userId: 1,
        createdAt: new Date(),
        status: 'OPEN',
        imageUrl: 'test-image.jpg'
      });
      
      prisma.item.findMany.mockResolvedValue([]); // Mock matching

      const res = await request(app)
        .post('/api/lost-items')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', newItem.name);
      expect(res.body).toHaveProperty('potentialMatches');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app).post('/api/lost-items').send({});
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/found-items', () => {
    it('should fetch found items', async () => {
      const mockItems = [
        {
          id: 3,
          name: 'Found Keys',
          description: 'Silver keychain',
          location: 'Parking Lot',
          type: 'FOUND',
          date: new Date(),
          userId: 1,
          createdAt: new Date(),
          status: 'OPEN',
          imageUrl: 'keys.jpg'
        },
      ];

      prisma.item.findMany.mockResolvedValue(mockItems);

      const res = await request(app).get('/api/found-items');

      expect(res.statusCode).toEqual(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].name).toBe('Found Keys');
    });
  });

  describe('POST /api/found-items', () => {
    it('should create a found item', async () => {
      const newItem = {
        name: 'Found Wallet',
        description: 'Brown leather',
        location: 'Cafeteria',
        foundDate: new Date().toISOString(),
      };

      prisma.item.findFirst.mockResolvedValue(null); // No direct match for auto-linking
      prisma.item.create.mockResolvedValue({
        id: 4,
        ...newItem,
        date: new Date(newItem.foundDate),
        type: 'FOUND',
        userId: 1,
        createdAt: new Date(),
        status: 'OPEN',
        imageUrl: 'test-image.jpg',
        matchedLostItemId: null
      });
      
      prisma.item.findMany.mockResolvedValue([]); // Mock potential matches

      const res = await request(app)
        .post('/api/found-items')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', newItem.name);
      expect(res.body).toHaveProperty('potentialMatches');
    });
  });
});
