const prisma = require('../shared/utils/prismaClient');

const formatItem = (item) => {
  const base = {
    id: item.id.toString(),
    name: item.name,
    description: item.description,
    location: item.location,
    contactInfo: item.contactInfo || '',
    imageUrl: item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `/uploads/${item.imageUrl}`) : null,
    userId: item.userId.toString(),
    createdAt: item.createdAt.toISOString(),
    status: item.status,
  };

  if (item.type === 'LOST') {
    return { ...base, lostDate: item.date.toISOString() };
  }

  return {
    ...base,
    foundDate: item.date.toISOString(),
    matchedLostItemId: item.matchedLostItemId
      ? item.matchedLostItemId.toString()
      : undefined,
  };
};

const findPotentialMatches = async (item) => {
  const targetType = item.type === 'LOST' ? 'FOUND' : 'LOST';
  
  // Basic matching algorithm
  // 1. Match on location (partial)
  // 2. Match on name/description (partial)
  // 3. Status must be OPEN
  
  const matches = await prisma.item.findMany({
    where: {
      type: targetType,
      status: 'OPEN',
      OR: [
        { location: { contains: item.location, mode: 'insensitive' } },
        { name: { contains: item.name, mode: 'insensitive' } },
        { description: { contains: item.name, mode: 'insensitive' } },
        { name: { contains: item.description, mode: 'insensitive' } } // simplified
      ]
    },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  
  return matches;
};

const getLostItems = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;

    const where = {
      type: 'LOST',
    };

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ items: items.map(formatItem) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lost items' });
  }
};

const createLostItem = async (req, res) => {
  try {
    const { name, description, location, lostDate, contactInfo } = req.body;
    const userId = req.user.userId;
    const imageUrl = req.file ? req.file.filename : req.body.imageUrl;

    if (!name || !location || !lostDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = await prisma.item.create({
      data: {
        name,
        description,
        location,
        date: new Date(lostDate),
        contactInfo,
        imageUrl,
        type: 'LOST',
        userId,
      },
    });

    // Find matches
    const matches = await findPotentialMatches(item);

    res.status(201).json({
      ...formatItem(item),
      potentialMatches: matches.map(formatItem)
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Failed to create lost item', details: error.message });
  }
};

const getFoundItems = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;

    const where = {
      type: 'FOUND',
    };

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const token = req.header('Authorization')?.replace('Bearer ', '');
    let isAdmin = false;
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role === 'ADMIN') isAdmin = true;
        } catch (e) {
            // ignore
        }
    }

    const formattedItems = items.map(item => {
        if (isAdmin) return formatItem(item);
        
        return {
            id: item.id.toString(),
            category: item.category,
            color: item.color,
            date: item.date.toISOString(),
            status: item.status,
            type: item.type
        };
    });

    res.json({ items: formattedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch found items' });
  }
};

const createFoundItem = async (req, res) => {
  try {
    const { name, description, location, foundDate, contactInfo } = req.body;
    const userId = req.user.userId;
    const imageUrl = req.file ? req.file.filename : req.body.imageUrl;

    if (!name || !location || !foundDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use the findMatches logic or keep existing simple one?
    // I'll use the new matching logic to find the best match to link if possible,
    // or just leave it open and return matches.
    // The previous code linked it automatically. I'll preserve that behavior if a strong match is found.
    
    const potentialMatch = await prisma.item.findFirst({
      where: {
        type: 'LOST',
        status: 'OPEN',
        name: {
          contains: name,
          mode: 'insensitive',
          },
        },
      orderBy: { createdAt: 'desc' },
    });

    const item = await prisma.item.create({
      data: {
        name,
        description,
        location,
        date: new Date(foundDate),
        contactInfo,
        imageUrl,
        type: 'FOUND',
        category: req.body.category || 'Other',
        color: req.body.color,
        userId,
        matchedLostItemId: potentialMatch ? potentialMatch.id : null,
      },
    });

    const matches = await findPotentialMatches(item);

    res.status(201).json({
      ...formatItem(item),
      potentialMatches: matches.map(formatItem)
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Failed to create found item', details: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, date, contactInfo, status, imageUrl } = req.body;
    const userId = req.user.userId;

    const existingItem = await prisma.item.findUnique({ where: { id: parseInt(id) } });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (existingItem.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        location,
        date: date ? new Date(date) : undefined,
        contactInfo,
        status,
        imageUrl,
      },
    });

    res.json(formatItem(item));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check ownership or admin role
    if (item.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. You are not the owner of this item.' });
    }

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete item', details: error.message });
  }
};

const claimItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.type !== 'FOUND') {
      return res.status(400).json({ error: 'Only found items can be claimed' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Notify all admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    
    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        title: 'Claim Request',
        message: `User ${user.name} (${user.email}) wants to claim item: ${item.name}`,
        type: 'CLAIM_REQUEST',
        relatedItemId: item.id,
      })),
    });

    res.json({ message: 'Claim request sent to admins' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit claim request' });
  }
};

const notifyOwner = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.type !== 'LOST') {
      return res.status(400).json({ error: 'Can only notify owners of lost items' });
    }

    await prisma.notification.create({
      data: {
        userId: item.userId,
        title: 'Item Found!',
        message: `Good news! We have found your item: ${item.name}. Please come to the office to verify and reclaim it.`,
        type: 'ITEM_FOUND',
        relatedItemId: item.id,
      },
    });

    res.json({ message: 'Owner notified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to notify owner' });
  }
};

module.exports = {
  getLostItems,
  createLostItem,
  getFoundItems,
  createFoundItem,
  findPotentialMatches,
  deleteItem,
  updateItem,
  claimItem,
  notifyOwner
};
