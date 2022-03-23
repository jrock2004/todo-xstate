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
          // faking a load time
          await new Promise((resolve) => setTimeout(resolve, 2000));

          return [];
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
            todo: (context, e) => e.value,
            isError: (context) => false,
          }),
        },
        ADD_TODO: {
          actions: assign({
            todo: (context) => '',
            isError: (context) => (context.todo.length > 0 ? false : true),
            todos: (context) => {
              return context.todo.length
                ? [
                    ...context.todos,
                    {
                      id: uuid().toString(),
                      text: context.todo,
                      completed: false,
                    },
                  ]
                : [...context.todos];
            },
          }),
        },
        TOGGLE_TODO: {
          actions: assign({
            todos: (context, e) => {
              return context.todos.map((todo) =>
                todo.id === e.value.id ? { ...todo, completed: !todo.completed } : todo
              );
            },
          }),
        },
        REMOVE_TODO: {
          actions: assign({
            todos: (context, e) => {
              return context.todos.filter((todo) => todo.id !== e.value.id);
            },
          }),
        },
      },
    },
  },
});
