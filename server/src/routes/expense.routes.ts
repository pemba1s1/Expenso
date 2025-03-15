import express from 'express';
import { addExpenseController, approveExpenseController } from '../controllers/expense.controller';
import { authenticateToken, isGroupAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /expense:
 *   post:
 *     summary: Add a new expense
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               receiptImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Expense added successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, upload.single('receiptImage'), addExpenseController);

/**
 * @swagger
 * /expense/approve:
 *   post:
 *     summary: Approve an expense
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense approved successfully
 *       500:
 *         description: Internal server error
 */
router.post('/approve', authenticateToken, isGroupAdmin, approveExpenseController);

export default router;
