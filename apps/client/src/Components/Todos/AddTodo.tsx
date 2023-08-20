import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect } from "react";
import { XCircle } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { TAddTodoSchema, addTodoSchema } from "shared/zodSchemas.ts";

import { TodoType } from "../../Types/types.ts";
import { queryClient } from "../../main.tsx";
import Button from "../UI/Button.tsx";

function AddTodo({
  setAddTodo,
}: {
  setAddTodo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    reset,
  } = useForm<TAddTodoSchema>({
    resolver: zodResolver(addTodoSchema),
  });

  const { mutate } = useMutation(
    async (data: TAddTodoSchema) => {
      await axios.post("/todo/add", { content: data.content });
    },
    {
      onMutate: async (data: TAddTodoSchema) => {
        await queryClient.cancelQueries("todos");

        const previousTodos: { data: { todos: TodoType[] } } | undefined =
          queryClient.getQueryData("todos");

        if (previousTodos?.data?.todos) {
          queryClient.setQueryData("todos", () => {
            return {
              data: {
                success: true,
                todos: [
                  ...previousTodos.data.todos,
                  { content: data.content, id: Date.now(), done: false },
                ],
              },
            };
          });

          toast.success("Todo added ✌️");
          setAddTodo(false);
        }

        return { previousTodos };
      },
      onError: (error, data, context) => {
        queryClient.setQueryData("todos", context?.previousTodos);

        if (error instanceof Error) toast.error(error.message);
        else toast.error("Could not add 😶");

        setValue("content", data.content);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries("todos");
      },
    },
  );

  // Focus on the add to-do when the component mounts
  useEffect(() => {
    const firstInput = document.querySelector(
      "#todo",
    ) as HTMLInputElement | null;

    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  // Close the add to-do modal when the user presses the escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAddTodo(false);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [setAddTodo]);

  function onSubmit(data: TAddTodoSchema) {
    mutate(data);
    reset();
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gray-800 opacity-90"></div>
      <button
        type="button"
        onClick={() => setAddTodo(false)}
        className="absolute left-0 right-0 top-10 z-20 sm:left-16 sm:right-12"
      >
        <XCircle className="mx-auto sm:mx-0" />
      </button>
      <div className="absolute z-20 w-full">
        <form
          className="container mx-auto mt-5 flex flex-col items-center justify-center gap-5 p-7"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="todo" className={"w-full text-center md:w-1/2"}>
            <input
              id="todo"
              {...register("content")}
              placeholder="Add Todo"
              className="mb-3 w-full rounded border-none bg-gray-200 p-2 text-gray-900 outline-none focus:bg-gray-50"
            />
            <span>
              {errors.content ? (
                <span className="text-amber-400">
                  {errors.content?.message}
                </span>
              ) : (
                ""
              )}
            </span>
          </label>
          <label
            htmlFor="type"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            <select
              id="type"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 font-serif text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option selected value="TODO">
                To-do
              </option>
              <option value="STREAKZZZ">Streakz</option>
            </select>
          </label>
          <Button
            className="mt-7 p-3 sm:p-4"
            type="submit"
            isSubmitting={isSubmitting}
            tabIndex={1}
          >
            Add
          </Button>
        </form>
      </div>
    </>
  );
}

export default AddTodo;
