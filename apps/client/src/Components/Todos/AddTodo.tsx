import Button from "../UI/Button.tsx";
import { useForm } from "react-hook-form";
import { TAddTodoSchema, addTodoSchema } from "shared/zodSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../../main.tsx";
import { TodoType } from "../../Types/types.ts";
import toast from "react-hot-toast";

function AddTodo() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
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

          return { previousTodos };
        }
      },
      onError: (error, _data, context) => {
        queryClient.setQueryData("todos", context?.previousTodos);

        if (error instanceof Error) toast.error(error.message);
        else toast.error("Could not add 😶");
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
        className="container mx-auto mt-5 flex flex-wrap items-center justify-center gap-5"
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
