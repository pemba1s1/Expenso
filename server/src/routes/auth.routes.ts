import express from 'express';
import { googleLogin, googleCallback } from '../controllers/auth.controller';

const router = express.Router();

// Route for Google login
router.get('/google', googleLogin);

// Google callback route
router.get('/google/callback', googleCallback);

export default router;
