import React, {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

interface TodoProps {
  id: string;
  completed: boolean;
  text: string;
}

const Todo = ({ id, completed, text }: TodoProps) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const className = completed ? "line-through" : "";
  const ctx = api.useContext();

  const updateTodo = api.todo.updateComplete.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  function handleChange() {
    updateTodo.mutate({ id, complete: completed });
  }

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  const updateTodoText = api.todo.updateTodo.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  function edit() {
    setShow(true);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function submitChange() {
    updateTodoText.mutate({ id, text: input });
  }

  return (
    <>
      <li className="mt-2 flex gap-2">
        <input
          onChange={handleChange}
          type="checkbox"
          checked={completed}
          className="checkbox"
        />
        <p className={`${className}`}>{text}</p>
        <button
          className="btn btn-square btn-xs"
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
        <button onClick={edit}>Edit</button>
        {show && (
          <>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
            ></input>
            <button onClick={submitChange} type="submit">
              Change
            </button>
          </>
        )}
      </li>
    </>
  );
};

export default Todo;
