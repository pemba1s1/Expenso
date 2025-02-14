import jwt from "jsonwebtoken";
import { config } from "./env";

export const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRATION });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id }, config.REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRATION });
};

export const verifyAccessToken = (token: string) => jwt.verify(token, config.JWT_SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, config.REFRESH_SECRET);
