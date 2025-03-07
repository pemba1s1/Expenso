import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
