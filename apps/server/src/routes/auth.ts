import { Router } from "express";

import {
  getMe,
  postLogin,
  postLogout,
  postSignup,
} from "../controllers/auth.js";
import { jwtVerify } from "../middlewares/jwtVerify.js";

const router: Router = Router();

// Authentication routes
router.get("/me", jwtVerify, getMe);

router.post("/login", postLogin);
router.post("/signup", postSignup);

router.post("/logout", postLogout);

export default router;
