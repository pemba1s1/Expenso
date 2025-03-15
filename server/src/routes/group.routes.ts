import express from 'express';
import { createGroupController, getGroupByIdController, getUserGroupsController, getGroupUsersController } from '../controllers/group.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management
 */

/**
 * @swagger
 * /group/create:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/create', authenticateToken, createGroupController);

/**
 * @swagger
 * /group/all:
 *   get:
 *     summary: Get all groups for the current user
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 *       500:
 *         description: Internal server error
 */
router.get('/all', authenticateToken, getUserGroupsController);

/**
 * @swagger
 * /group/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, getGroupByIdController);

/**
 * @swagger
 * /group/{id}/users:
 *   get:
 *     summary: Get users in a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get('/:id/users', authenticateToken, getGroupUsersController);

export default router;