const prisma = require('../shared/utils/prismaClient');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
