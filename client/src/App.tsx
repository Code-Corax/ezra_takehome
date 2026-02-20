import { useState, useEffect } from 'react'
import './App.css';
import type { Todo } from './app/api/todoApiModels';
import { getAllTodos } from './app/api/todosApi';
import SidePanel from './app/components/SidePanel';
import TodoPanel from './app/components/TodoPanel';
import styled from "styled-components";


function App() {
  const [data, setData] = useState<Todo[] | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllTodos();
        setData(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error has occured while attempting to fetch for base page.');
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  return (
    <AppStyled>
      <SidePanel />
      <TodoPanel todos={data}/>
    </AppStyled>
  )
}

const AppStyled = styled.div`
  padding: 30px 15px;
  display: flex;
  gap: 15px;
  height: 100%;
  transition: all 0.3s ease-in-out; 

  .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
`;


export default App;
