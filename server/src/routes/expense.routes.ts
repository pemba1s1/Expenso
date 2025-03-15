import express from 'express';
import { addExpenseController, approveExpenseController } from '../controllers/expense.controller';
import { authenticateToken, isGroupAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/', authenticateToken, upload.single('receiptImage'), addExpenseController);
router.post('/approve', authenticateToken, isGroupAdmin, approveExpenseController);

export default router;
