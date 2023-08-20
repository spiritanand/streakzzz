import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "react-feather";

import AddTodoForm from "./AddTodoForm.tsx";

function AddTodo() {
  const [isAddTodo, setIsAddTodo] = useState(false);

  return (
    <>
      <button
        className="absolute bottom-10 right-10 rounded-2xl bg-red-600 p-2"
        onClick={() => setIsAddTodo((prevState) => !prevState)}
      >
        <Plus className="" size={32} />
      </button>
      {isAddTodo
        ? createPortal(<AddTodoForm setAddTodo={setIsAddTodo} />, document.body)
        : null}
    </>
  );
}

export default AddTodo;
