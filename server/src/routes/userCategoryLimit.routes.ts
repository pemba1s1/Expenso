import express from 'express';
import { setUserCategoryLimitController, updateCategoryLimitController, getUserCategoryLimitsController } from '../controllers/userCategoryLimit.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserCategoryLimit
 *   description: User category limit management
 */

/**
 * @swagger
 * /userCategoryLimit:
 *   post:
 *     summary: Set spending limit for a user category-wise
 *     tags: [UserCategoryLimit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               limit:
 *                 type: number
 *     responses:
 *       201:
 *         description: User category limit set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 limit:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: User ID is missing
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, setUserCategoryLimitController);


/**
 * @swagger
 * /userCategoryLimit:
 *   post:
 *     summary: Set spending limit for a user category-wise
 *     tags: [UserCategoryLimit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               limit:
 *                 type: number
 *     responses:
 *       201:
 *         description: User category limit set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 limit:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: User ID is missing
 *       500:
 *         description: Internal server error
 */
router.patch('/', authenticateToken, updateCategoryLimitController);

/**
 * @swagger
 * /userCategoryLimit:
 *   get:
 *     summary: Get user category limits
 *     tags: [UserCategoryLimit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *         description: Optional group ID to get category limits for a specific group
 *     responses:
 *       200:
 *         description: User category limits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   categoryId:
 *                     type: string
 *                   groupId:
 *                     type: string
 *                   limit:
 *                     type: number
 *                   year:
 *                     type: string
 *                   month:
 *                     type: string
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       400:
 *         description: User ID is missing
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, getUserCategoryLimitsController);

export default router;
