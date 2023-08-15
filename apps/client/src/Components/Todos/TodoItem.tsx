import axios from "axios";
import toast from "react-hot-toast";
import { TodoType } from "../../Types/types.ts";
import { useState } from "react";
import { queryClient } from "../../main.tsx";

type TodoItemProps = {
  todo: TodoType;
};

function TodoItem({ todo }: TodoItemProps) {
  const [isDone, setIsDone] = useState(todo.done);

  const toggleDone = async () => {
    try {
      setIsDone((prev) => !prev);
      const response = await axios.post("/todo/toggle", { id: todo.id });
      toast.success(response.data.message);
    } catch (e) {
      setIsDone((prev) => !prev);

      if (e instanceof Error) toast.error(e.message);
    } finally {
      await queryClient.invalidateQueries("todos");
    }
  };

  // const updateTodo = async (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <li className="flex items-center justify-center gap-6 border-b-amber-500 px-5 sm:gap-10">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 cursor-pointer accent-green-500"
        checked={isDone}
        onChange={toggleDone}
      />
      <input
        className="flex-1 rounded border-none bg-transparent p-2 outline-none focus:bg-gray-200 focus:text-gray-900"
        defaultValue={todo.content}
      />
    </li>
  );
}

export default TodoItem;
