import express from 'express';
import { googleLogin, googleCallback, registerUserController, loginUserController, verifyUserController, getCurrentUserController } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */
router.get('/google', googleLogin);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google login callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google login successful
 *       401:
 *         description: Authentication failed
 */
router.get('/google/callback', googleCallback);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid email/password
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerUserController);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Authentication failed
 *       400:
 *         description: Invalid email/password
 */
router.post('/login', loginUserController);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify a user
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Verification token is required
 *       500:
 *         description: Internal server error
 */
router.get('/verify', verifyUserController);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user data
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticateToken, getCurrentUserController);

export default router;
