import express from 'express';
import { addExpenseController } from '../controllers/expense.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/', authenticateToken, upload.single('receiptImage'), addExpenseController);

export default router;
