import express from 'express';
import { inviteUserController, acceptInvitationController } from '../controllers/invitation.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, inviteUserController);
router.post('/accept', acceptInvitationController);

export default router;