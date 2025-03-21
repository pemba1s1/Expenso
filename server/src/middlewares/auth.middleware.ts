import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { User } from "@prisma/client";
import prisma from "../config/prismaClient";

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

export const isGroupAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.user as User;
  const { groupId } = req.body;

  if (!user || !groupId) {
    res.status(403).json({ message: "Access denied! User or group doesn't exist" });
    return;
  }

  try {
    // Check if the user is an admin of the group
    const userGroup = await prisma.userGroup.findFirst({
      where: { userId: user.id, groupId },
    });

    if (!userGroup || userGroup.role != "admin") {
      res.status(403).json({ message: "Access denied! User is not an admin of the group" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
