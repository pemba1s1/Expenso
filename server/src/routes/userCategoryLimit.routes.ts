import express from 'express';
import { setUserCategoryLimitController, updateCategoryLimitController } from '../controllers/userCategoryLimit.controller';
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

export default router;
