import { combineReducers, configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";

export const rootReducer = combineReducers({
  todos: todoReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;


