import axios from "axios";
import { useState } from "react";
import { Check, Delete, X } from "react-feather";
import toast from "react-hot-toast";

import { TodoType } from "../../Types/types.ts";
import { queryClient } from "../../main.tsx";

type TodoItemProps = {
  todo: TodoType;
};

function TodoItem({ todo }: TodoItemProps) {
  const [isDone, setIsDone] = useState(todo.done);
  const [isEditing, setIsEditing] = useState(false);

  const toggleDone = async () => {
    try {
      setIsDone((prev) => !prev);
      const response = await axios.patch("/todo/toggle", { id: todo.id });
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
      <form className="relative flex-1" noValidate>
        <input
          className="w-full rounded border-none bg-transparent p-2 outline-none focus:bg-gray-200 focus:text-gray-900"
          defaultValue={todo.content}
          onFocus={() => {
            setIsEditing(true);
          }}
          onBlur={() => {
            setIsEditing(false);
          }}
        />
        <button
          className={`${
            isEditing ? "absolute" : "hidden"
          }  -bottom-7 right-12 rounded-md bg-gray-400 text-gray-900 transition-colors duration-200 hover:bg-green-600`}
        >
          <Check />
        </button>
        <button
          className={`${
            isEditing ? "absolute" : "hidden"
          } -bottom-7 right-4 rounded-md bg-gray-400 text-gray-900 transition-colors duration-200 hover:bg-red-600`}
        >
          <X />
        </button>
      </form>
      <Delete />
    </li>
  );
}

export default TodoItem;
