import { ChangeEvent, KeyboardEvent, ReactElement, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';

import { todosMachine } from '../../machines/todosMachine';
import { Todo } from '../Todo';
import { ToggleFilter } from '../ToggleFilter';

export const Todos = (): ReactElement => {
  const [current, send] = useMachine(todosMachine);
  const [filteredTodos, setFilteredTodos] = useState(current.context.todos);
  const [filterType, setFilterType] = useState('All');

  const allTodos = current.context.todos;
  const completedTodos = allTodos.filter((todo) => todo.completed);
  const incompleteTodos = allTodos.filter((todo) => !todo.completed);
  const isLoading = current.context.isLoading;

  useEffect(() => {
    send('FETCH');
  }, [send]);

  useEffect(() => {
    if (filterType === 'All') {
      setFilteredTodos(allTodos);
    } else if (filterType === 'Active') {
      setFilteredTodos(incompleteTodos);
    } else {
      setFilteredTodos(completedTodos);
    }
  }, [current.context.todos, filterType]);

  return (
    <div className="bg-white rounded-md mt-8 shadow-2xl w-1/2 max-w-xl">
      <input
        className="p-4 bg-white w-full border-b-slate-200 border-t-0 border-l-0 border-r-0"
        data-trackid="new-todo-text"
        placeholder="What needs to be done?"
        type="text"
        value={current.context.todo}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
          send({
            type: 'UPDATE_NEW_TODO',
            value: e.target.value,
          });
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>): void => {
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
        {!isLoading && filteredTodos.length === 0 && (
          <li className="bg-white p-4">
            <span className="block w-full">You have nothing coming up! Add a todo</span>
          </li>
        )}
        {filteredTodos.length > 0 &&
          filteredTodos.map((todo) => <Todo key={`todo-${todo.id}`} send={send} todo={todo} />)}
      </ul>
      <div className="flex bg-white p-4 py-2">
        <div className="mr-32">
          <span className="text-sm text-slate-500">{filteredTodos.length} items left</span>
        </div>
        <div className="flex">
          <ToggleFilter
            filterType={filterType}
            isLoading={isLoading}
            setFilterType={setFilterType}
            text="All"
          />
          <ToggleFilter
            filterType={filterType}
            isLoading={isLoading}
            setFilterType={setFilterType}
            text="Active"
          />
          <ToggleFilter
            filterType={filterType}
            isLoading={isLoading}
            setFilterType={setFilterType}
            text="Completed"
          />
        </div>
      </div>
    </div>
  );
};
