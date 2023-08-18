import { Router } from "express";

import {
  getTodos,
  postAddTodo,
  postEditTodo,
  postToggleTodo,
} from "../controllers/todos.js";

const router: Router = Router();

router.get("/todos", getTodos);
router.post("/todo/add", postAddTodo);
router.patch("/todo/toggle", postToggleTodo);
router.patch("/todo/edit", postEditTodo);

export default router;
