import express from 'express';
import { googleLogin, googleCallback, registerUserController, loginUserController, verifyUserController, getCurrentUserController } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Route for Google login
router.get('/google', googleLogin);

// Google callback route
router.get('/google/callback', googleCallback);

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/verify/:token', verifyUserController);

// Protected route to get the current user's data
router.get('/me', authenticateToken, getCurrentUserController);

export default router;
