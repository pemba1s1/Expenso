import jwt from "jsonwebtoken";
import { config } from "./env";
import ms from "ms";

export const generateAccessToken = (user: any, expiresIn: ms.StringValue = config.JWT_ACCESS_EXPIRATION) => {
  return jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, { expiresIn });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id }, config.REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRATION });
};

export const verifyAccessToken = (token: string) => jwt.verify(token, config.JWT_SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, config.REFRESH_SECRET);
