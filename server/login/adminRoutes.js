const express = require('express');
const { 
  getAllUsers, 
  resetUserPassword, 
  updateUserRole, 
  getSystemStats, 
  getPasswordResetRequests,
  getSystemSettings,
  toggleMaintenanceMode,
  runDataCleanup,
  getRecentActivity
} = require('./adminController');
const authMiddleware = require('./authMiddleware');
const adminMiddleware = require('./adminMiddleware');

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// ... existing routes ...

router.get('/settings', getSystemSettings);
router.post('/settings/maintenance', toggleMaintenanceMode);
router.post('/settings/cleanup', runDataCleanup);
router.get('/activity', getRecentActivity);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 activeReports:
 *                   type: integer
 *                 activeLostReports:
 *                   type: integer
 *                 activeFoundReports:
 *                   type: integer
 *                 resolvedItems:
 *                   type: integer
 *       403:
 *         description: Forbidden
 */
router.get('/stats', getSystemStats);

/**
 * @swagger
 * /admin/password-requests:
 *   get:
 *     summary: Get users requesting password reset
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get('/password-requests', getPasswordResetRequests);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /admin/users/{userId}/password:
 *   put:
 *     summary: Reset user password
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       403:
 *         description: Forbidden
 */
router.put('/users/:userId/password', resetUserPassword);

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: Role updated
 *       403:
 *         description: Forbidden
 */
router.put('/users/:userId/role', updateUserRole);

module.exports = router;
