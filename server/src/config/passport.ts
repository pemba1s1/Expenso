import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env';
import { findOrCreateUser } from '../services/user.service';
import { logger } from '../utils/logger';

// Passport strategy for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.CALLBACK_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create a user in the database
        const user = await findOrCreateUser(profile);
        logger.info(`User ${user.email} authenticated with Google`);
        return done(null, user);
      } catch (err) {
        logger.error('Error authenticating user with Google', err);
        return done(err, undefined);
      }
    }
  )
);
