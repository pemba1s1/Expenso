import prisma from '../config/prismaClient';
import { logger } from '../utils/logger';
import bcryptjs from 'bcryptjs';
import { sendVerificationEmail } from './email.service';
import { generateAccessToken, verifyAccessToken } from '../config/jwt';
import { User } from '@prisma/client';
import { config } from '../config/env';
import crypto from 'crypto';
import { isEmailValid, isPasswordValid } from '../utils/validation';

export const findOrCreateUser = async (profile: any) => {
  try {
    // Check if user already exists in the database
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos ? profile.photos[0].value : null,
          verified: true,
        },
      });
      logger.info(`New user created: ${profile.emails[0].value}`);
    }

    return user;
  } catch (error) {
    logger.error('Error while finding/creating user', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, name?: string) => {
  try {
    if (!isEmailValid(email)) {
      throw new Error('Invalid email format');
    }
    if (!isPasswordValid(password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one number and one special character');
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationCode = crypto.randomBytes(4).toString('hex');
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken: verificationCode,
        verificationTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
      },
    });

    logger.info(`New user created: ${user.email}`);

    const verificationLink = `${config.CLIENT_URL}/auth/verify?token=${verificationCode}`;
    logger.info(`Verification link: ${verificationLink}`);
    await sendVerificationEmail(email, verificationLink);
    return user;
  } catch (error) {
    logger.error('Error while registering user', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    if (!isEmailValid(email)) {
      throw new Error('Invalid email format');
    }
    if (!password) {
      throw new Error('Password is required');
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password || !password) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.verified) {
      throw new Error('Account not verified');
    }

    const accessToken = generateAccessToken(user);
    return { accessToken, user };
  } catch (error) {
    logger.error('Error while logging in user', error);
    throw error;
  }
};

export const verifyUser = async (token: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { 
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    if (user.verified) {
      throw new Error('Account already verified');
    }

    return await prisma.user.update({
      where: { id: user.id },
      data: { 
        verified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      },
    });
  } catch (error) {
    logger.error('Error while verifying user', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    logger.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    logger.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};
