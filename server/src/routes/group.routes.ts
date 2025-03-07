import express from 'express';
import { createGroupController } from '../controllers/group.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create', authenticateToken, createGroupController);

export default router;