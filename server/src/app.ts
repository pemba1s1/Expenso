import express from "express";
import passport from "passport";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import authRoutes from "./routes/auth.routes";
import './config/passport';  // Initialize passport strategy
import { logger } from './utils/logger';

const app = express();

// Middleware to log HTTP requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.use(passport.initialize());
app.use("/auth", authRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});

export default app;
