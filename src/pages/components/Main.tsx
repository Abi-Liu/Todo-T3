import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Todo from "./Todo";

const Main = () => {
  const [input, setInput] = useState("");
  const { data: sessionData } = useSession();
  const ctx = api.useContext();

  const { data: todoData } = api.todo.getTodosByUser.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const createTodo = api.todo.createTodo.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.todo.getTodosByUser.invalidate();
    },
  });

  if (!sessionData?.user) {
    return (
      <>
        <h1>Please Login to get Started</h1>
      </>
    );
  }

  return (
    <>
      <div className="form-control w-full max-w-xs">
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <label className="label">
          <span className="label-text">Add todo</span>
        </label>
        <input
          type="text"
          value={input}
          placeholder="Todo"
          onChange={(e) => setInput(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            createTodo.mutate({ text: input });
          }}
        >
          Submit
        </button>
      </div>
      <div>
        <ul>
          {todoData?.map((todo) => (
            <Todo
              key={todo.id}
              id={todo.id}
              completed={todo.completed}
              text={todo.text}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Main;
