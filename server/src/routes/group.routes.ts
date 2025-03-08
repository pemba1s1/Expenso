import express from 'express';
import { createGroupController, getGroupByIdController, getUserGroupsController } from '../controllers/group.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create', authenticateToken, createGroupController);
router.get('/all', authenticateToken, getUserGroupsController);
router.get('/:id', authenticateToken, getGroupByIdController);

export default router;