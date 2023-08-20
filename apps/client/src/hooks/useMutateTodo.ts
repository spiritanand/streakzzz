import axios from "axios";
import React from "react";
import { UseFormSetValue } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { TAddTodoSchema, TodoTypes } from "shared/zodSchemas.ts";

import { TTodoType } from "../Types/types.ts";
import { queryClient } from "../main.tsx";

export function useMutateTodo(
  setAddTodo: React.Dispatch<React.SetStateAction<boolean>>,
  setValue: UseFormSetValue<TAddTodoSchema>,
) {
  const { mutate } = useMutation(
    async (data: TAddTodoSchema) => {
      await axios.post("/todo/add", { content: data.content, type: data.type });
    },
    {
      onMutate: async (data: TAddTodoSchema) => {
        await queryClient.cancelQueries(["todos"]);

        const previousTodos: { data: { todos: TTodoType[] } } | undefined =
          data.type === TodoTypes.STREAK
            ? queryClient.getQueryData([TodoTypes.STREAK])
            : queryClient.getQueryData([TodoTypes.TODO]);

        if (previousTodos?.data?.todos) {
          if (data.type === TodoTypes.STREAK) {
            toast.success("Streak added 🔥️");
          } else {
            queryClient.setQueryData(["todos"], () => {
              return {
                data: {
                  success: true,
                  todos: [
                    ...previousTodos.data.todos,
                    {
                      content: data.content,
                      type: data.type,
                      id: Date.now(),
                      done: false,
                    },
                  ],
                },
              };
            });

            toast.success("Todo added ✌️");
          }

          setAddTodo(false);
        }

        return { previousTodos };
      },
      onError: (error, data, context) => {
        if (data.type === TodoTypes.STREAK) {
          queryClient.setQueryData([TodoTypes.STREAK], context?.previousTodos);
        } else {
          queryClient.setQueryData([TodoTypes.TODO], context?.previousTodos);
        }

        setAddTodo(true);

        if (error instanceof Error) toast.error(error.message);
        else toast.error("Could not add 😶");

        setValue("content", data.content);
        setValue("type", data.type);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([TodoTypes.TODO]);
        await queryClient.invalidateQueries([TodoTypes.STREAK]);
      },
    },
  );

  return { mutate };
}
