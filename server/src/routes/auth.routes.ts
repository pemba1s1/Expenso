import { Router } from "express";
import passport from "passport";
import { authSuccess, authFail, logout } from "../controllers/auth.controller";

const router = Router();

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/fail" }), authSuccess);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/auth/fail" }), authSuccess);

// Logout
router.get("/logout", logout);
router.get("/fail", authFail);

export default router;
