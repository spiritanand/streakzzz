import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { XCircle } from "react-feather";
import { useForm } from "react-hook-form";
import { TodoTypes } from "shared/types.ts";
import { TAddTodoSchema, addTodoSchema } from "shared/zodSchemas.ts";

import useA11yModal from "../../hooks/useA11yModal.ts";
import { useMutateTodo } from "../../hooks/useMutateTodo.ts";
import Button from "../UI/Button.tsx";

function AddTodoForm({
  setAddTodo,
}: {
  setAddTodo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useA11yModal(setAddTodo);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    reset,
  } = useForm<TAddTodoSchema>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      content: "",
      type: TodoTypes.TODO,
    },
  });

  const { mutate } = useMutateTodo(setAddTodo, setValue);

  function onSubmit(data: TAddTodoSchema) {
    mutate(data);
    reset();
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-10 bg-gray-800 opacity-90" />
      <button
        type="button"
        onClick={() => setAddTodo(false)}
        className="absolute left-0 right-0 top-10 z-20 sm:left-16 sm:right-12"
      >
        <XCircle className="mx-auto sm:mx-0" />
      </button>
      <div className="absolute top-32 z-20 w-full">
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
              {...register("type")}
            >
              <option value={TodoTypes.TODO}>To-do</option>
              <option value={TodoTypes.STREAK}>Streakz</option>
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

export default AddTodoForm;
