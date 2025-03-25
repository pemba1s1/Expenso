import express from 'express';
import { subscribeUser } from '../controllers/subscription.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: User Subscription
 */

/**
 * @swagger
 * /subscribe:
 *   post:
 *     summary: Subscribe a user
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planName:
 *                 type: string
 *                 description: The ID of the subscription plan
 *     responses:
 *       200:
 *         description: User subscribed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/subscribe', authenticateToken, subscribeUser);

export default router;
