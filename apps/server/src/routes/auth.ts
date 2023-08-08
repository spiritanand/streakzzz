import express, { Router } from "express";
import { login, signup } from "../controllers/auth";

const router: Router = Router();

// Middleware to parse JSON
router.use(express.json());

// Authentication routes
router.post("/login", login);
router.post("/signup", signup);

export default router;
