import axios from "axios";
import { useQuery } from "react-query";
import { TodoTypes } from "shared/zodSchemas.ts";

import Loading from "./Loading/Loading.tsx";
import TodoItem from "../Components/Todos/TodoItem.tsx";
import { TTodoType } from "../Types/types.ts";

function TodosList({ queryKey }: { queryKey: TodoTypes }) {
  const { data, isLoading, error } = useQuery(
    [queryKey],
    () => axios.get(`/todos/${queryKey}`),
    {
      // refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000,
    },
  );

  if (isLoading) return <Loading className="min-h-screen" />;

  if (error)
    return (
      <h1 className="min-h-screen text-center text-3xl">
        Could not load {queryKey}! 🥺
      </h1>
    );

  return (
    <div className="min-h-screen">
      <h1 className="text-center text-xl font-extrabold">
        Your {queryKey.toUpperCase()}
      </h1>
      {data?.data?.todos.length > 0 ? (
        <ul className="container mx-auto mt-5 flex flex-col gap-10">
          {data?.data?.todos?.map((todo: TTodoType) => (
            <TodoItem key={todo.id} todo={todo} queryKey={queryKey} />
          ))}
        </ul>
      ) : (
        <div className="mt-16 text-center text-xl font-bold sm:text-3xl">
          You are all clear for the day 🤩
        </div>
      )}
    </div>
  );
}

export default TodosList;
