import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
