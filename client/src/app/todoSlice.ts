import { createSlice, createAsyncThunk, isRejected } from '@reduxjs/toolkit';
import { getAllTodos, createTodo, updateTodo, deleteTodo, toggleIsDone } from './api/todosApi';
import type { CreateTodoInput, Todo, ToggleIsDoneInput, UpdateTodoInput } from './api/todoApiModels';

type TodosState = {
    todos: Todo[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };

  const initialState: TodosState = {
    todos: [],
    status: "idle",
    error: null,
  };

    //State manipulating functions
    export const getAllTodosThunk = createAsyncThunk<Todo[]>(
        "todos/fetchTodos",
        async () => {
            return await getAllTodos();
        }
    );

    export const createTodoThunk = createAsyncThunk<Todo, CreateTodoInput>(
        "todos/createTodo",
        async (payload) => {
            return await createTodo(payload)
        }
    );

    export const updateTodoThunk = createAsyncThunk<Todo, { id: string; payload: UpdateTodoInput }>(
        "todos/updateTodo",
        async ({ id, payload }) => await updateTodo(id, payload)
    );

    export const deleteTodoThunk = createAsyncThunk<string, string>(
        "todos/deleteTodo",
        async (id) => {
            await deleteTodo(id);
            return id;
        }
    );
    
    export const toggleIsDoneThunk = createAsyncThunk<Todo, { id: string; payload: ToggleIsDoneInput }>(
        "todos/toggleIsDone",
        async ({ id, payload }) => await toggleIsDone(id, payload)
    );

    const isTodoRejected = isRejected(
        getAllTodosThunk,
        createTodoThunk,
        updateTodoThunk,
        deleteTodoThunk,
        toggleIsDoneThunk
    );

    export const todoSlice = createSlice({
        name: 'todos',
        initialState,
        reducers: {
            clearError(state) {
                state.error = null;
            },
        },
        extraReducers: (builder) => {
            builder
            .addCase(getAllTodosThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllTodosThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.todos = action.payload;
            })
            .addCase(createTodoThunk.fulfilled, (state, action) => {
                state.todos.unshift(action.payload)
            })
            .addCase(updateTodoThunk.fulfilled, (state, action) => {
                const idx = state.todos.findIndex((t) => t.id === action.payload.id);
                if (idx !== -1) state.todos[idx] = action.payload;
            })
            .addCase(toggleIsDoneThunk.fulfilled, (state, action) => {
                const idx = state.todos.findIndex((t) => t.id === action.payload.id);
                if (idx !== -1) state.todos[idx] = action.payload;
            })
            .addCase(deleteTodoThunk.fulfilled, (state, action) => {
                state.todos = state.todos.filter((t) => t.id !== action.payload);
            })

            // shared error handling for mutation thunks
            .addMatcher(isTodoRejected, (state, action) => {
                state.error = action.error.message ?? "Request failed";
            });
        },
    })

export default todoSlice.reducer;
export const { clearError } = todoSlice.actions;