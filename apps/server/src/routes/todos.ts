import { Router } from "express";

import {
  deleteTodo,
  getTodos,
  postAddTodo,
  postEditTodo,
  postToggleTodo,
} from "../controllers/todos.js";

const router: Router = Router();

router.get("/todos/:type", getTodos);

router.post("/todo/add", postAddTodo);

router.patch("/todo/toggle", postToggleTodo);
router.patch("/todo/edit", postEditTodo);

router.delete("/todo/delete/:id", deleteTodo);

export default router;
