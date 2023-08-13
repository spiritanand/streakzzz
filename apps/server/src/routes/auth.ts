import express, { Router } from "express";
import {
  getMe,
  postLogin,
  postLogout,
  postSignup,
} from "../controllers/auth.js";

const router: Router = Router();

// Middleware to parse JSON
router.use(express.json());

// Authentication routes
router.get("/me", getMe);

router.post("/login", postLogin);
router.post("/signup", postSignup);

router.post("/logout", postLogout);

export default router;
