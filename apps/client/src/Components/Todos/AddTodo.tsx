import Button from "../UI/Button.tsx";
import { useForm } from "react-hook-form";
import { addTodoSchema, TAddTodoSchema } from "shared/zodSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../main.tsx";

function AddTodo() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<TAddTodoSchema>({
    resolver: zodResolver(addTodoSchema),
  });

  type Todos =
    | { data: { todos: { content: string; id: number; done: boolean }[] } }
    | undefined;

  const { mutate } = useMutation(
    async (data: TAddTodoSchema) => {
      await axios.post("/todo/add", { content: data.content });
    },
    {
      onMutate: async (data: TAddTodoSchema) => {
        await queryClient.cancelQueries("todos");

        const previousTodos: Todos = queryClient.getQueryData("todos");

        if (previousTodos?.data?.todos) {
          queryClient.setQueryData("todos", () => {
            return [
              ...previousTodos.data.todos,
              { content: data.content, id: Date.now(), done: false },
            ];
          });

          return { previousTodos };
        }
      },
      onError: (_error, _data, context) => {
        queryClient.setQueryData("todos", context?.previousTodos);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries("todos");
      },
    },
  );

  function onSubmit(data: TAddTodoSchema) {
    mutate(data);
    reset();
  }

  return (
    <>
      <form
        className="container mx-auto flex flex-wrap items-center justify-center gap-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <label
          htmlFor="todo"
          className={"flex flex-col gap-1 md:w-1/2 md:gap-2"}
        >
          <input
            {...register("content")}
            placeholder="Add Todo"
            className="rounded border-none bg-gray-200 p-2 text-gray-900 outline-none focus:bg-gray-50"
          />
        </label>
        <Button
          className="p-3 sm:p-4"
          type="submit"
          isSubmitting={isSubmitting}
        >
          Add
        </Button>
        <span className="w-screen text-center">
          {errors.content ? (
            <span className="text-amber-400">{errors.content?.message}</span>
          ) : (
            ""
          )}
        </span>
      </form>
    </>
  );
}

export default AddTodo;
