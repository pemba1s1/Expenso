import express from 'express';
import { inviteUserController, acceptInvitationController } from '../controllers/invitation.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: Invitation management
 */

/**
 * @swagger
 * /invitation:
 *   post:
 *     summary: Invite a user to a group
 *     tags: [Invitations]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 groupId:
 *                   type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, inviteUserController);

/**
 * @swagger
 * /invitation/accept:
 *   post:
 *     summary: Accept an invitation
 *     tags: [Invitations]
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