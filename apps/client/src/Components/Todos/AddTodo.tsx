import Button from "../UI/Button.tsx";
import { useForm } from "react-hook-form";
import { addTodoSchema, TAddTodoSchema } from "shared/zodSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";

function AddTodo() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TAddTodoSchema>({
    resolver: zodResolver(addTodoSchema),
  });

  return (
    <>
      <form
        className="container mx-auto flex flex-wrap items-center justify-center gap-5"
        noValidate
        onSubmit={handleSubmit((data) => console.log(data))}
      >
        <label
          htmlFor="todo"
          className={"flex flex-col gap-1 md:w-1/2 md:gap-2"}
        >
          <input
            {...register("todo")}
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
          {errors.todo ? (
            <span className="text-amber-400">{errors.todo?.message}</span>
          ) : (
            ""
          )}
        </span>
      </form>
    </>
  );
}

export default AddTodo;
