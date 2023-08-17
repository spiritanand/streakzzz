import { Router } from "express";

import { getTodos, postAddTodo, postToggleTodo } from "../controllers/todos.js";

const router: Router = Router();

router.get("/todos", getTodos);
router.post("/todo/add", postAddTodo);
router.patch("/todo/toggle", postToggleTodo);

export default router;
