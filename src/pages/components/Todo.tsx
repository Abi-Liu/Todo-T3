import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

interface TodoProps {
  id: string;
  completed: boolean;
  text: string;
}

const Todo = ({ id, completed, text }: TodoProps) => {
  const [checked, setChecked] = useState(completed);
  const className = checked ? "line-through" : "";
  const ctx = api.useContext();

  const updateTodo = api.todo.updateComplete.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
      setChecked((prev) => !prev);
    },
  });

  function handleChange() {
    updateTodo.mutate({ id, complete: checked });
  }

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  return (
    <>
      <li className="flex gap-2">
        <input
          onChange={handleChange}
          type="checkbox"
          checked={checked}
          className="checkbox"
        />
        <p className={`${className}`}>{text}</p>
        <button
          className="btn btn-square"
          onClick={() => deleteTodo.mutate({ id })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </li>
    </>
  );
};

export default Todo;
