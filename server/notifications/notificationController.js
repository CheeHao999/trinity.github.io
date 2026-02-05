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
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await prisma.notification.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

const notifyUser = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    
    // Only admin can send manual notifications
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        title,
        message,
        type: type || 'ADMIN_MESSAGE',
      },
    });

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  notifyUser,
};
