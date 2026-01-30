const prisma = require('../shared/utils/prismaClient');

const maintenanceMiddleware = async (req, res, next) => {
  // Skip for admin routes and auth routes
  if (req.path.startsWith('/api/admin') || req.path.startsWith('/api/auth')) {
    return next();
  }

  try {
    const maintenanceSetting = await prisma.systemSetting.findUnique({
      where: { key: 'maintenance_mode' },
    });

    if (maintenanceSetting && maintenanceSetting.value === 'true') {
      // Check if user is admin (if authenticated)
      // Note: This relies on authMiddleware running BEFORE this if we want to allow admins.
      // But usually maintenance mode blocks everyone except maybe explicit admin login.
      // For simplicity, let's block all non-admin-route API calls.
      return res.status(503).json({ 
        error: 'System is under maintenance',
        maintenance: true 
      });
    }

    next();
  } catch (error) {
    console.error('Maintenance check failed:', error);
    next(); // Fail open to allow traffic if DB is weird, or fail closed? Let's fail open.
  }
};

module.exports = maintenanceMiddleware;
