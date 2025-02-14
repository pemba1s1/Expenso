import { Request, Response } from 'express';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken } from '../config/jwt';
import { logger } from '../utils/logger';
import { User } from '@prisma/client';

// Google login route
export const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google callback route
export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    logger.warn('Google login failed');
    res.status(401).send('Authentication failed');
    return;
  }

  // Generate JWT tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Set the refresh token as an HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,  // Use `false` for local dev or HTTP (use `true` for production with HTTPS)
    sameSite: "strict",
  });

  // Send the JWT tokens back to the client
  res.json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  });
};
