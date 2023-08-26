import { useAutoAnimate } from "@formkit/auto-animate/react";
import axios from "axios";
import { useQuery } from "react-query";
import { TodoTypes } from "shared/zodSchemas.ts";

import TodoItem from "../Components/Todos/TodoItem.tsx";
import { TTodoType } from "../Types/types.ts";

function TodosList({ queryKey }: { queryKey: TodoTypes }) {
  const [parent] = useAutoAnimate(/* optional config */);

  const { data, error } = useQuery(
    [queryKey],
    () => axios.get(`/todos/${queryKey}`),
    {
      staleTime: 5 * 60 * 1000,
    },
  );

  if (error)
    return (
      <h1 className="min-h-screen text-center text-3xl">
        Could not load {queryKey}! 🥺
      </h1>
    );

  return (
    <div className="mx-auto min-h-screen max-w-fit">
      <h1 className="text-center text-xl font-extrabold">
        Your {queryKey.toUpperCase()}S
      </h1>
      <ul
        className={`container mx-auto mt-5 flex flex-col ${
          queryKey === TodoTypes.STREAK ? "gap-14" : "gap-10"
        }`}
        ref={parent}
        key={queryKey}
      >
        {data?.data?.todos.length > 0 ? (
          <>
            {data?.data?.todos?.map((todo: TTodoType) => (
              <TodoItem key={todo.id} todo={todo} queryKey={queryKey} />
            ))}
          </>
        ) : null}
        {data?.data?.todos.length === 0 ? (
          <li className="mt-16 text-center text-xl font-bold sm:text-3xl">
            You are all clear for the day 🤩
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default TodosList;
