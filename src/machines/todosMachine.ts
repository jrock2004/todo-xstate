import { createMachine, assign } from 'xstate';
import { v4 as uuid } from 'uuid';

import { TTodo } from '../Todo';

export type TTodoMachineContext = {
  isError: boolean;
  isLoading: boolean;
  todo: string;
  todos: TTodo[];
};

export const todosMachine = createMachine<TTodoMachineContext>({
  id: 'todos',
  initial: 'idle',
  context: {
    isError: false,
    isLoading: true,
    todo: '',
    todos: [],
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading',
      },
    },
    loading: {
      invoke: {
        id: 'fetchTodos',
        src: async () => {
          const todos = JSON.parse(localStorage.getItem('todos') || '[]');

          // faking a load time
          await new Promise((resolve) => setTimeout(resolve, 2000));

          return todos;
        },
        onDone: {
          actions: assign({
            todos: (_, event) => event.data,
            isLoading: (_) => false,
          }),
        },
      },
      on: {
        UPDATE_NEW_TODO: {
          actions: assign({
            todo: (ctx, e) => e.value,
            isError: (ctx) => false,
          }),
        },
        ADD_TODO: {
          actions: assign({
            todo: (ctx) => '',
            isError: (ctx) => (ctx.todo.length > 0 ? false : true),
            todos: (ctx) => {
              const todos = ctx.todo.length
                ? [
                    ...ctx.todos,
                    {
                      id: uuid().toString(),
                      text: ctx.todo,
                      completed: false,
                    },
                  ]
                : [...ctx.todos];

              persistTodos(todos);

              return todos;
            },
          }),
        },
        TOGGLE_TODO: {
          actions: assign({
            todos: (ctx, e) => {
              const todos = ctx.todos.map((todo) =>
                todo.id === e.value.id ? { ...todo, completed: !todo.completed } : todo
              );

              persistTodos(todos);

              return todos;
            },
          }),
        },
        REMOVE_TODO: {
          actions: assign({
            todos: (ctx, e) => {
              const todos = ctx.todos.filter((todo) => todo.id !== e.value.id);

              persistTodos(todos);

              return todos;
            },
          }),
        },
      },
    },
  },
});

const persistTodos = (todos: TTodoMachineContext['todos']) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
