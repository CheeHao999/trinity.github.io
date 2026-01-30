const express = require('express');
const { getLostItems, createLostItem, getFoundItems, createFoundItem, deleteItem, updateItem, claimItem, notifyOwner } = require('./itemController');
const authMiddleware = require('../login/authMiddleware');
const upload = require('./uploadMiddleware');

const lostItemRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: LostItems
 *     description: Lost items management
 *   - name: FoundItems
 *     description: Found items management
 */

/**
 * @swagger
 * /lost-items:
 *   get:
 *     summary: Get all lost items
 *     tags: [LostItems]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, description, or location
 *     responses:
 *       200:
 *         description: List of lost items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       location:
 *                         type: string
 *                       lostDate:
 *                         type: string
 *                         format: date-time
 *                       contactInfo:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new lost item
 *     tags: [LostItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - lostDate
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               lostDate:
 *                 type: string
 *                 format: date-time
 *               contactInfo:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Lost item created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
lostItemRouter.get('/', getLostItems);
lostItemRouter.post('/', authMiddleware, upload.single('image'), createLostItem);
lostItemRouter.put('/:id', authMiddleware, upload.single('image'), updateItem);
lostItemRouter.delete('/:id', authMiddleware, deleteItem);
lostItemRouter.post('/:id/notify-owner', authMiddleware, notifyOwner);

const foundItemRouter = express.Router();

/**
 * @swagger
 * /found-items:
 *   get:
 *     summary: Get all found items
 *     tags: [FoundItems]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, description, or location
 *     responses:
 *       200:
 *         description: List of found items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       location:
 *                         type: string
 *                       foundDate:
 *                         type: string
 *                         format: date-time
 *                       contactInfo:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new found item
 *     tags: [FoundItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - foundDate
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               foundDate:
 *                 type: string
 *                 format: date-time
 *               contactInfo:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Found item created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
foundItemRouter.get('/', getFoundItems);
foundItemRouter.post('/', authMiddleware, upload.single('image'), createFoundItem);
foundItemRouter.delete('/:id', authMiddleware, deleteItem);
foundItemRouter.post('/:id/claim', authMiddleware, claimItem);

module.exports = {
  lostItemRouter,
  foundItemRouter,
};
