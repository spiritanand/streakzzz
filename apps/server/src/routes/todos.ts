import { Router } from "express";
import { getTodos, postAddTodo } from "../controllers/todos.js";

const router: Router = Router();

router.get("/todos", getTodos);
router.post("/todo/add", postAddTodo);

export default router;
