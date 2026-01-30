const express = require('express');
const { getNotifications, markAsRead, notifyUser } = require('./notificationController');
const authMiddleware = require('../login/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.post('/notify-user', notifyUser);

module.exports = router;
