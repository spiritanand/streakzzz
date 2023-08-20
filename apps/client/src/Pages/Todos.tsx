import axios from "axios";
import { useState } from "react";
import { Plus } from "react-feather";
import { useQuery } from "react-query";

import Loading from "./Loading/Loading.tsx";
import AddTodo from "../Components/Todos/AddTodo.tsx";
import TodoItem from "../Components/Todos/TodoItem.tsx";
import { TodoType } from "../Types/types.ts";

function Todos() {
  const [isAddTodo, setIsAddTodo] = useState(false);
  const { data, isLoading, error } = useQuery(
    "todos",
    () => axios.get("/todos"),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  );

  if (isLoading) return <Loading className="min-h-screen" />;

  if (error)
    return (
      <h1 className="min-h-screen text-center text-3xl">
        Could not load todos!
      </h1>
    );

  return (
    <div className="min-h-screen">
      <h1 className="text-center text-xl font-extrabold">Your Todos</h1>
      {isAddTodo ? <AddTodo setAddTodo={setIsAddTodo} /> : null}
      {data?.data?.todos.length > 0 ? (
        <ul className="container mx-auto mt-5 flex flex-col gap-10">
          {data?.data?.todos?.map((todo: TodoType) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <div className="mt-16 text-center text-xl font-bold sm:text-3xl">
          You are all clear for the day 🤩
        </div>
      )}
      <button
        className="absolute bottom-10 right-10 rounded-2xl bg-red-600 p-2"
        onClick={() => setIsAddTodo((prevState) => !prevState)}
      >
        <Plus className="" size={32} />
      </button>
    </div>
  );
}

export default Todos;
