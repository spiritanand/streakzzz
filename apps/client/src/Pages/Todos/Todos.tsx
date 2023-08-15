import AddTodo from "../../Components/Todos/AddTodo.tsx";
import axios from "axios";
import Loading from "../Loading/Loading.tsx";
import { useQuery } from "react-query";
import TodoItem from "../../Components/Todos/TodoItem.tsx";
import { TodoType } from "../../Types/types.ts";

function Todos() {
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
      <AddTodo />
      {data?.data?.todos.length > 0 ? (
        <ul className="container mx-auto mt-5 flex flex-col gap-6">
          {data?.data?.todos?.map((todo: TodoType) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <div>You are all clear for the day 🤩</div>
      )}
    </div>
  );
}

export default Todos;
