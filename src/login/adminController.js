const bcrypt = require('bcryptjs');
const prisma = require('../shared/utils/prismaClient');

const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    
    const activeLostReports = await prisma.item.count({
      where: {
        type: 'LOST',
        status: 'OPEN',
      },
    });

    const activeFoundReports = await prisma.item.count({
      where: {
        type: 'FOUND',
        status: 'OPEN',
      },
    });

    const resolvedItems = await prisma.item.count({
      where: {
        status: 'RESOLVED',
      },
    });

    res.json({
      totalUsers,
      activeReports: activeLostReports + activeFoundReports,
      activeLostReports,
      activeFoundReports,
      resolvedItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getPasswordResetRequests = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isPasswordResetRequested: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch password reset requests' });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { 
        password: hashedPassword,
        isPasswordResetRequested: false // Clear the flag
      },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
    });

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

const getSystemSettings = async (req, res) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    const formattedSettings = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    // Default values if not present
    if (!formattedSettings.maintenance_mode) formattedSettings.maintenance_mode = 'false';
    
    res.json(formattedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const toggleMaintenanceMode = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    await prisma.systemSetting.upsert({
      where: { key: 'maintenance_mode' },
      update: { value: String(enabled) },
      create: { key: 'maintenance_mode', value: String(enabled) },
    });
    
    res.json({ message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update maintenance mode' });
  }
};

const runDataCleanup = async (req, res) => {
  try {
    // Delete items resolved more than 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const result = await prisma.item.deleteMany({
      where: {
        status: 'RESOLVED',
        updatedAt: {
          lt: ninetyDaysAgo,
        },
      },
    });
    
    res.json({ message: `Cleanup complete. ${result.count} items archived/deleted.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to run data cleanup' });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    // Fetch recent items
    const recentItems = await prisma.item.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    
    // Fetch recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    
    // Combine and format
    const activities = [
      ...recentItems.map(item => ({
        id: `item-${item.id}`,
        type: 'REPORT_SUBMITTED',
        title: `New ${item.type} Report`,
        description: `${item.user?.name || 'Unknown User'} reported a ${item.name} (${item.type})`,
        timestamp: item.createdAt,
        meta: { status: item.status, location: item.location }
      })),
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'USER_REGISTERED',
        title: 'New User Registration',
        description: `${user.name} (${user.email}) joined the platform`,
        timestamp: user.createdAt,
        meta: { email: user.email }
      }))
    ];
    
    // Sort combined list by date desc
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Return top 10
    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};

module.exports = {
  getSystemStats,
  getAllUsers,
  getPasswordResetRequests,
  resetUserPassword,
  updateUserRole,
  getSystemSettings,
  toggleMaintenanceMode,
  runDataCleanup,
  getRecentActivity,
};
