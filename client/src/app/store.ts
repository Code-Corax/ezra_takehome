import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";

export const TodoStore = configureStore({
  reducer: {
    todos: todoReducer,
  }
});

export type RootState = ReturnType<typeof TodoStore.getState>;
export type AppDispatch = typeof TodoStore.dispatch;
export default TodoStore;