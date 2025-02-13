import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { config } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { requestLogger, errorLogger } from "./config/logger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.use(errorLogger);

export default app;
