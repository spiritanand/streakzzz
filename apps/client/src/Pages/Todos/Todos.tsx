import AddTodo from "../../Components/Todos/AddTodo.tsx";
import { useQuery } from "react-query";
import axios from "axios";
import { Key } from "react";

function Todos() {
  const { data } = useQuery("todos", () => axios.get("/todos"), {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen">
      <AddTodo />
      {data?.data?.todos.length > 0 ? (
        data?.data?.todos?.map((todo: { id: Key; content: string }) => (
          <div key={todo.id}>{todo.content}</div>
        ))
      ) : (
        <div>You are all clear for the day 🤩</div>
      )}
    </div>
  );
}

export default Todos;
