import express from 'express';
import { googleLogin, googleCallback, registerUserController, loginUserController, verifyUserController } from '../controllers/auth.controller';

const router = express.Router();

// Route for Google login
router.get('/google', googleLogin);

// Google callback route
router.get('/google/callback', googleCallback);

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/verify/:token', verifyUserController);

export default router;
