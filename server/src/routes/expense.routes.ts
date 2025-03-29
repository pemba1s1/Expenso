import express from 'express';
import { addExpenseFromReceiptController, approveExpenseController, getUserExpensesController, getExpenseByIdController, addIndividualExpenseController } from '../controllers/expense.controller';
import { monthlyExpenseSummaryController, monthlyInsightController } from '../controllers/expenseSummary.controller';
import { authenticateToken, isGroupAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management
 */

/**
 * @swagger
 * /expense:
 *   post:
 *     summary: Add a new individual expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: string
 *                 description: Amount of the expense
 *               description:
 *                 type: string
 *                 description: Description of the expense
 *               groupId:
 *                 type: string
 *                 description: Group ID for the expense
 *               categoryName:
 *                 type: string
 *                 description: Name of the expense category
 *               receiptImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional receipt image for the expense
 *     responses:
 *       201:
 *         description: Expense added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 amount:
 *                   type: number
 *                 description:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 status:
 *                   type: string
 *                 receiptId:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Amount, description, group ID, and category name are required
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, upload.single('receiptImage'), addIndividualExpenseController);

/**
 * @swagger
 * /expense/receipt:
 *   post:
 *     summary: Add expenses from a receipt image
 *     tags: [Expenses]
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
 *                 description: Receipt image to process
 *               groupId:
 *                 type: string
 *                 description: Group ID for the expenses
 *     responses:
 *       200:
 *         description: Receipt processed and expenses created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Receipt and expenses created successfully
 *                 expenseCount:
 *                   type: number
 *                   description: Number of expenses created from the receipt
 *                 receiptId:
 *                   type: string
 *                   description: ID of the created receipt
 *       400:
 *         description: Group ID is missing or no receipt image provided
 *       500:
 *         description: Internal server error
 */
router.post('/receipt', authenticateToken, upload.single('receiptImage'), addExpenseFromReceiptController);

/**
 * @swagger
 * /expense/approve:
 *   post:
 *     summary: Approve an expense
 *     tags: [Expenses]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 amount:
 *                   type: number
 *                 description:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 status:
 *                   type: string
 *                 receiptId:
 *                   type: string
 *                   nullable: true
 *       403:
 *         description: Not Authorized
 *       500:
 *         description: Internal server error
 */
router.post('/approve', authenticateToken, isGroupAdmin, approveExpenseController);

/**
 * @swagger
 * /expense/summary:
 *   get:
 *     summary: Get expense summary
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: true
 *         description: Year for the summary (YYYY)
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month for the summary (1-12)
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Group ID for the summary
 *     responses:
 *       200:
 *         description: Expense summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAmount:
 *                   type: number
 *                 totalAmountPerCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       amount:
 *                         type: number
 *       400:
 *         description: Year and month are required
 *       500:
 *         description: Internal server error
 */
router.get('/summary', authenticateToken, monthlyExpenseSummaryController);

/**
 * @swagger
 * /expense/monthly-insight:
 *   get:
 *     summary: Get monthly expense insights
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID for the insights
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: true
 *         description: Year for insights (YYYY)
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month for insights (1-12)
 *       - in: query
 *         name: newInsight
 *         schema:
 *           type: boolean
 *         description: Whether to generate a new insight or use cached one
 *     responses:
 *       200:
 *         description: Monthly insights retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: Overall summary of the month's spending
 *                 topCategories:
 *                   type: string
 *                   description: Analysis of the highest spending categories
 *                 savingOpportunities:
 *                   type: string
 *                   description: Areas where spending could be reduced
 *                 tips:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Actionable tips for better financial management
 *       400:
 *         description: Group ID, year, and month are required
 *       500:
 *         description: Internal server error
 */
router.get('/monthly-insight', authenticateToken, monthlyInsightController);

/**
 * @swagger
 * /expense/user:
 *   get:
 *     summary: Get all expenses of a specific user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Group ID to filter expenses
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: true
 *         description: Year for filtering expenses (YYYY)
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month for filtering expenses (1-12)
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   receiptImageUrl:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   groupId:
 *                     type: string
 *                     nullable: true
 *       400:
 *         description: Year and month are required
 *       500:
 *         description: Internal server error
 */
router.get('/user', authenticateToken, getUserExpensesController);

/**
 * @swagger
 * /expense/{id}:
 *   get:
 *     summary: Get a specific expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 receiptImageUrl:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 groupId:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Expense ID is missing
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, getExpenseByIdController);

export default router;
