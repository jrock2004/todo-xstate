import { ReactElement, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';

import { todosMachine } from '../../machines/todosMachine';
import { Todo } from '../Todo';
import { ToggleFilter } from '../ToggleFilter';

export const Todos = (): ReactElement => {
  const [current, send] = useMachine(todosMachine);
  const [filterType] = useState('All');

  const allTodos = current.context.todos;
  // const completedTodos = allTodos.filter((todo) => todo.completed);
  // const incompleteTodos = allTodos.filter((todo) => !todo.completed);
  const isLoading = current.context.isLoading;

  useEffect(() => {
    send('FETCH');
  }, [send]);

  return (
    <div className="bg-white rounded-md w-1/2 mt-8 shadow-2xl">
      <input
        className="p-4 bg-white w-full border-b-slate-200 border-t-0 border-l-0 border-r-0"
        data-trackid="new-todo-text"
        placeholder="What needs to be done?"
        type="text"
        value={current.context.todo}
        onChange={(e) => {
          send({
            type: 'UPDATE_NEW_TODO',
            value: e.target.value,
          });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            send({ type: 'ADD_TODO' });
          }
        }}
      />
      <ul className="list-none m-0 p-0">
        {isLoading && (
          <li className="bg-white p-4 border-b">
            <span className="block w-full">Loading...</span>
          </li>
        )}
        {!isLoading && allTodos.length === 0 && (
          <li className="bg-white p-4">
            <span className="block w-full">You have nothing coming up! Add a todo</span>
          </li>
        )}
        {allTodos.length > 0 &&
          allTodos.map((todo) => <Todo key={`todo-${todo.id}`} send={send} todo={todo} />)}
      </ul>
      <div className="flex bg-white p-4 py-2">
        <div className="mr-32">
          <span className="text-sm text-slate-500">{allTodos.length} items left</span>
        </div>
        <div className="flex">
          <ToggleFilter filterType={filterType} isLoading={isLoading} text="All" />
          <ToggleFilter filterType={filterType} isLoading={isLoading} text="Active" />
          <ToggleFilter filterType={filterType} isLoading={isLoading} text="Completed" />
        </div>
      </div>
    </div>
  );
};
