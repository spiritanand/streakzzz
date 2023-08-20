import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Check, Trash2, X } from "react-feather";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TEditTodoSchema, editTodoSchema } from "shared/zodSchemas.ts";

import { TTodoType } from "../../Types/types.ts";
import { queryClient } from "../../main.tsx";

type TodoItemProps = {
  todo: TTodoType;
};

function TodoItem({ todo }: TodoItemProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    resetField,
  } = useForm<TEditTodoSchema>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: {
      id: todo.id,
      content: todo.content,
    },
  });

  const [isDone, setIsDone] = useState<boolean>(todo.done);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleDone = async () => {
    try {
      setIsDone((prev) => !prev);
      const response = await axios.patch("/todo/toggle", { id: todo.id });
      toast.success(response.data.message);
    } catch (e) {
      setIsDone((prev) => !prev);

      if (e instanceof Error) toast.error(e.message);
      else toast.error("Something went wrong");
    } finally {
      await queryClient.invalidateQueries("todos");
    }
  };

  const updateTodo: SubmitHandler<TEditTodoSchema> = async (data) => {
    try {
      if (isDirty) {
        const response = await axios.patch("/todo/edit", data);

        resetField("content", { defaultValue: data.content.trim() });

        toast.success(response.data.message);
        await queryClient.invalidateQueries("todos");
      }
      setIsEditing(false);
    } catch (e) {
      if (e instanceof Error) toast.error(e.message);
      setIsEditing(true);
      await queryClient.invalidateQueries("todos");
    }
  };

  const handleDeleteTodo = async () => {
    try {
      const res = await axios.delete(`/todo/delete/${todo.id}`);
      toast.success(res.data.message);
    } catch (e) {
      if (e instanceof Error) toast.error(e.message);
      else toast.error("Something went wrong");
    } finally {
      await queryClient.invalidateQueries("todos");
    }
  };

  return (
    <li className="flex items-center justify-center gap-6 border-b-amber-500 px-5 sm:gap-10">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 cursor-pointer accent-green-500"
        checked={isDone}
        onChange={toggleDone}
      />
      <form
        className="relative flex-1"
        onSubmit={handleSubmit(updateTodo)}
        noValidate
      >
        <input
          className={`w-full rounded bg-transparent p-2 outline-none  ${
            isDone
              ? "pointer-events-none cursor-not-allowed bg-gray-500 text-gray-700 line-through"
              : "focus:bg-gray-200 focus:text-gray-900"
          } ${isDirty && !isValid ? "border-2 border-red-400" : ""} ${
            isDirty && isValid ? "border-2 border-amber-400" : ""
          }`}
          {...register("content")}
          onFocus={() => {
            setIsEditing(true);
          }}
          onBlur={(e) => {
            const targetElement = e.relatedTarget as HTMLInputElement;
            if (
              e.relatedTarget?.nodeName === "BUTTON" &&
              (targetElement?.title === "Cancel" ||
                targetElement?.title === "Save")
            )
              return;

            setIsEditing(false);
          }}
        />
        {errors.content ? (
          <p className="mt-0.5 text-red-400">{errors.content.message}</p>
        ) : (
          ""
        )}
        {!errors.content && isDirty && !isValid ? (
          <p className="mt-0.5 text-red-400">Invalid</p>
        ) : (
          ""
        )}
        {!isEditing && isDirty && isValid ? (
          <p className="mt-0.5 text-amber-400">Not saved</p>
        ) : (
          ""
        )}
        <button
          type="submit"
          title="Save"
          className={`${
            isEditing ? "absolute" : "hidden"
          }  -bottom-7 right-12 rounded-md bg-gray-400 text-gray-900 transition-colors duration-200 hover:bg-green-600`}
        >
          <Check />
        </button>
        <button
          type="button"
          title="Cancel"
          className={`${
            isEditing ? "absolute" : "hidden"
          } -bottom-7 right-4 rounded-md bg-gray-400 text-gray-900 transition-colors duration-200 hover:bg-red-600`}
          onClick={() => {
            setIsEditing(false);
            resetField("content");
          }}
        >
          <X />
        </button>
      </form>
      <button onClick={handleDeleteTodo} title="Delete">
        <Trash2 className="cursor-pointer" />
      </button>
    </li>
  );
}

export default TodoItem;
