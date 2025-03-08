import prisma from '../config/prismaClient';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/email';
import { generateAccessToken, verifyAccessToken } from '../config/jwt';


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
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  logger.info(`New user created: ${user.email}`);

  const verificationToken = generateAccessToken(user, '1h');
  const verificationLink = `http://localhost:5000/auth/verify/${verificationToken}`;
  logger.info(`Verification link: ${verificationLink}`);
  // await sendVerificationEmail(email, verificationLink);

  return user;
};

export const loginUser = async (email: string, password: string) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    throw new Error('Invalid email or password');
  }

  if (!user || !user.password || !password) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  if (!user.verified) {
    throw new Error('Account not verified');
  }

  const accessToken = generateAccessToken(user);
  return { accessToken, user };
};

export const verifyUser = async (token: string) => {
  const decoded = verifyAccessToken(token) as { id: string, email: string, verified: boolean };

  if (!decoded) {
    throw new Error('Invalid token');
  }

  const user = await prisma.user.findFirst({
    where: { id: decoded.id }
  });

  if (user?.verified) {
    throw new Error('Account already verified');
  }

  return await prisma.user.update({
    where: { id: decoded.id },
    data: { verified: true },
  });
};
