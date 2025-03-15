import express from 'express';
import { inviteUserController, acceptInvitationController } from '../controllers/invitation.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /invitation:
 *   post:
 *     summary: Invite a user to a group
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               groupId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invitation sent successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, inviteUserController);

/**
 * @swagger
 * /invitation/accept:
 *   post:
 *     summary: Accept an invitation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invitationId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       500:
 *         description: Internal server error
 */
router.post('/accept', acceptInvitationController);

export default router;