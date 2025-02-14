import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

type Config = {
  PORT: string;
  DATABASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
  REFRESH_SECRET: string;
  CALLBACK_URL: string;
  JWT_ACCESS_EXPIRATION: ms.StringValue;
  JWT_REFRESH_EXPIRATION: ms.StringValue;
}

export const config = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretjwt",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "supersecretrefresh",
  CALLBACK_URL: process.env.CALLBACK_URL || "http://localhost:5000",
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION ||'7d',
} as Config;
