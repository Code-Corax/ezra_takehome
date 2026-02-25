import styled from "styled-components";
import TodoPanelHeader from "./TodoPanelHeader";
import TodoPanelBody from "./TodoPanelBody";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "../api/todoApiModels";
import CreateTodoModal from "./CreateTodoModal";
import { useState } from "react";
import { useAppDispatch } from "../hooks";
import { createTodoThunk, updateTodoThunk } from "../todoSlice";
import UpdateTodoModal from "./UpdateTodoModal";

interface Props {
    todos: Array<Todo>;
}

function TodoPanel({todos}: Props) {

    const [isCreateOpen, setIsCreateOpen] = useState(false),
        [isUpdateOpen, setIsUpdateOpen] = useState(false),
        [updatingTodo, setUpdatingTodo] = useState<Todo | null>(null);

    const dispatch = useAppDispatch();

    async function handleCreateTodo({title, description, priority}: CreateTodoInput) {
        await dispatch(createTodoThunk({title, description, priority})).unwrap();
    }

    async function handleUpdateTodo(id: string, {title, description, priority, isDone}: UpdateTodoInput) {
        await dispatch(updateTodoThunk({id, payload: {title, description, priority, isDone}})).unwrap();
    }

    const openCreate = () => setIsCreateOpen(true);
    const closeCreate = () => setIsCreateOpen(false);
    const openUpdate = (toUpdate: Todo) => { setIsUpdateOpen(true); setUpdatingTodo(toUpdate); }
    const closeUpdate = () => { setIsUpdateOpen(false); setUpdatingTodo(null); }

    return (
        <TodoPanelStyled>
            <TodoPanelHeader createTodoModalOpener={openCreate}/>
            <TodoPanelBody todos={todos} updateTodoModalOpener={openUpdate}/>
            <CreateTodoModal
                isOpen={isCreateOpen}
                onClose={closeCreate}
                onSubmit={handleCreateTodo}
            />
            {updatingTodo && <UpdateTodoModal 
                isOpen={isUpdateOpen}
                onClose={closeUpdate}
                onSubmit={handleUpdateTodo}
                updatingTodo={updatingTodo}
            />}
        </TodoPanelStyled>
    )
}

const TodoPanelStyled = styled.div`

    padding: 2rem;
    width: 100%;
    background-color: ${(props) => props.theme.colorBg2};
    border: 2px solid ${(props) => props.theme.borderColor2};
    border-radius: 1rem;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .tasks {
        margin: 2rem 0;
    }

    .create-task {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        height: 16rem;
        color: ${(props) => props.theme.colorGrey2};
        font-weight: 600;
        cursor: pointer;
        border-radius: 1rem;
        border: 3px dashed ${(props) => props.theme.colorGrey5};
        transition: all 0.3s ease;

        &:hover {
            background-color: ${(props) => props.theme.colorGrey5};
            color: ${(props) => props.theme.colorGrey0};
        }
    }

`;

export default TodoPanel;