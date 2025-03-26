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
 *                 type: number
 *                 description: Provide the amount of the expense
 *               details:
 *                 type: object
 *                 description: Provide details of the expense
 *               groupId:
 *                 type: string
 *                 nullable: true
 *                 description: Provide the group ID if the expense is for a group
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
 *                 details:
 *                   type: object
 *                 userId:
 *                   type: string
 *                 receiptImage:
 *                   type: string
 *                 status:
 *                   type: string
 *                   nullable: true
 *                 approvedBy:
 *                   type: string
 *                   nullable: true
 *                 groupId:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: User ID is missing or no receipt image provided
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, upload.single('receiptImage'), addIndividualExpenseController);


/**
 * @swagger
 * /expense:
 *   post:
 *     summary: Add a new expense
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
 *               groupId:
 *                 type: string 
 *                 nullable: true
 *                 description: Provide the group ID if the expense is for a group
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
 *                 details:
 *                   type: object
 *                 userId:
 *                   type: string
 *                 receiptImage:
 *                   type: string
 *                 status:
 *                   type: string
 *                   nullable: true
 *                 approvedBy:
 *                   type: string
 *                   nullable: true
 *                 groupId:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: User ID is missing or no receipt image provided
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
 *                 details:
 *                   type: object
 *                 userId:
 *                   type: string
 *                 receiptImage:
 *                   type: string
 *                 status:
 *                   type: string
 *                   nullable: true
 *                 approvedBy:
 *                   type: string
 *                   nullable: true
 *                 groupId:
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
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for the summary
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for the summary
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
 *         description: Start date and end date are required
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
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date (any day in the month) for which to get insights
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
 *         description: Group ID and date are required
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
 *         description: User ID is missing
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
