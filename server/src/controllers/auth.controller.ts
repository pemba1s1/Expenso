import { Request, Response } from 'express';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken } from '../config/jwt';
import { logger } from '../utils/logger';
import { User } from '@prisma/client';
import { registerUser, loginUser, verifyUser, getUserById, getUserByEmail } from '../services/user.service';

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

export const registerUserController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const userExist = await getUserByEmail(email);
    if (userExist) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const user = await registerUser(email, password, name);
    res.status(201).json(user);
  } catch (error) {
    logger.error(error);
    console.log(error)
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { accessToken, user } = await loginUser(email, password);
    res.status(200).json({ accessToken, user });
  } catch (error) {
    logger.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(401).json({ error: errorMessage });
  }
};

export const verifyUserController = async (req: Request, res: Response) => {
  const token = req.params.token || req.query.token as string;

  if (!token) {
    res.status(400).json({ error: 'Verification token is required' });
    return;
  }

  try {
    const user = await verifyUser(token);
    
    // Generate access token for the user
    const accessToken = generateAccessToken(user);
    
    // Return both the user and the access token
    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      }
    });
  } catch (error) {
    logger.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: errorMessage });
  }
};

export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    // req.user is set by the authenticateToken middleware
    const userId = (req.user as any)?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return
    }

    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }

    // Return user data without sensitive information
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
