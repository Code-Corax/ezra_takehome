import { useEffect, useMemo, useState } from 'react'
import './App.css';
import SidePanel from './app/components/SidePanel';
import TodoPanel from './app/components/TodoPanel';
import styled from "styled-components";
import { getAllTodosThunk } from './app/todoSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { toaster } from './components/ui/toaster-instance';
import { clearError } from "./app/todoSlice";
import type { TodoFilter } from './app/utils/TodoFilter';

function App() {
  const status = useAppSelector((s) => s.todos.status),
    error = useAppSelector((s) => s.todos.error);

  const dispatch = useAppDispatch();

  const [activeFilter, setActiveFilter] = useState<TodoFilter>("all");

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllTodosThunk());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (!error) return;

    toaster.create({
      type: "error",
      title: "Request failed",
      description: error,
      closable: true,
    });

    dispatch(clearError());
  }, [error, dispatch]);

  const todos = useAppSelector((s) => s.todos.todos);

  const filteredTodos = useMemo(() => {
    switch (activeFilter) {
      case "complete": return todos.filter(t => t.isDone);
      case "incomplete": return todos.filter(t => !t.isDone);
      case "highPriority": return todos.filter(t => t.priority >= 4);
      default: return todos;
    }
  }, [todos, activeFilter]);

  return (
    <AppStyled>
      <SidePanel activeFilter={activeFilter} onSelectFilter={setActiveFilter}/>
      <TodoPanel todos={filteredTodos}/>
    </AppStyled>
    
  )
}

const AppStyled = styled.div`
  padding: 20px 10px 20px 0px;
  display: flex;
  gap: 10px;
  height: 100%;
  width: 100%;
  transition: all 0.3s ease-in-out; 

  .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
`;


export default App;
