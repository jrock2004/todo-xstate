import { ReactElement } from 'react';
import { Sender } from 'xstate';

import { TTodo } from '../../Todo';

type TTodoItem = {
  send: Sender<any>;
  todo: TTodo;
};

export const Todo = ({ send, todo }: TTodoItem): ReactElement => {
  const handleChange = (): void => {
    send({
      type: 'TOGGLE_TODO',
      value: todo,
    });
  };

  const handleRemove = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();

    send({ type: 'REMOVE_TODO', value: todo });
  };

  return (
    <li
      className="bg-white p-4 flex items-center border-b border-b-slate-200"
      data-todo-state={todo.completed ? 'completed' : 'active'}
    >
      <input
        aria-labelledby={`todo-${todo.id}`}
        checked={todo.completed}
        className="border h-7 w-7 mr-5 text-amber-600"
        data-trackid="toggle-todo-status"
        type="checkbox"
        onChange={handleChange}
      />
      <span className="block" id={`todo-${todo.id}`}>
        {todo.text}
      </span>
      <button
        aria-label={`Remove ${todo.text}`}
        className="ml-auto text-slate-600 hover:text-slate-400"
        data-trackid="remove-todo"
        onClick={handleRemove}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
      </button>
    </li>
  );
};
