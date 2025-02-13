import { Request, Response } from "express";

export const authSuccess = (req: Request, res: Response) => {
  res.json({ user: req.user });
};

export const authFail = (req: Request, res: Response) => {
  res.status(401).json({ message: "Authentication failed" });
};

export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
};
