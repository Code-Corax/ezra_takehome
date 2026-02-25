import styled from "styled-components";
import type { Todo } from "../api/todoApiModels";
import { useState } from "react";
import { deleteTodoThunk, toggleIsDoneThunk } from "../todoSlice";
import { useAppDispatch } from "../hooks";

interface Props {
    todoItem: Todo;
    updateTodoModalOpener: (toUpdate: Todo) => void
}

function TodoLine({todoItem, updateTodoModalOpener}: Props) {

    const dispatch = useAppDispatch();
    const [showDesc, setShowDesc] = useState('none');

    function toggleRowPanel() {
        if(showDesc == 'none') {
            setShowDesc('block');
        }
        else {
            setShowDesc('none');
        }
    }

    function toggleIsDoneAndUpdate(toUpdateId: string, toUpdateValue: boolean) {
        dispatch(toggleIsDoneThunk({id: toUpdateId, payload: { isDone: toUpdateValue }}));
    }

    function deleteTodo(toDelete: string) {
        dispatch(deleteTodoThunk(toDelete));
    }

    return (
        <TodoLineStyled className={showDesc === "block" ? "is-open" : ""}>
            <div className="todo-line">
                <div className="todo-panel-body-line-is-done">
                    <input type="checkbox" checked={todoItem.isDone} onChange={() => toggleIsDoneAndUpdate(todoItem.id, !todoItem.isDone)}></input>
                </div>
                <div className="openable" onClick={() => { toggleRowPanel() }}>
                    <div className="todo-panel-body-line-priorty">{todoItem.priority}</div>
                    <div className="todo-panel-body-line-title">{todoItem.title}</div>
                    <div className="todo-panel-body-line-date-created">{todoItem.dateCreated}</div>
                </div>
            </div>
                
            
            <div className={`todo-panel-body-line-description desc-row-${"-" + todoItem.id}`} style={{display: showDesc}}>
                <div className="todo-panel-body-line-description-text">{todoItem.description}</div>
                <div className="todo-panel-body-line-footer">
                    <button className={`todo-panel-body-line-edit desc-row-${"-" + todoItem.id}`} onClick={() => updateTodoModalOpener(todoItem)}>Edit</button>
                    <button className={`todo-panel-body-line-delete desc-row-${"-" + todoItem.id}`} onClick={() => deleteTodo(todoItem.id)}>Trash</button>
                </div>
            </div>
        </TodoLineStyled>
    );
}

const TodoLineStyled = styled.div<{$showDesc?: string;}>`
    border-top: 2px solid ${(props) => props.theme.borderColor2};
    width: 100%;

    .todo-line {
        display: flex;
        height: 55px;;
        align-items: center;

        .todo-panel-body-line-is-done {
            width: 6%;
            padding-left: 10px;

            >input {
                cursor: pointer;
            }
        }

        .openable {
            width: 100%;
            height: 100%;
            display: flex;
            cursor: pointer;
            align-items: center;
            
            .todo-panel-body-line-priorty {
                width: 10%;
                padding-left: 10px;
            }
            .todo-panel-body-line-title {
                width: 69%;
                padding-left: 10px;
            }
            .todo-panel-body-line-date-created {
                width: 20%;
                padding-left: 10px;
            }
        }
    }

    .todo-line:hover {
        background-color: ${(props) => props.theme.colorGrey5};
    }

    &.is-open:hover .todo-line,
    &.is-open:hover .todo-panel-body-line-description {
        background-color: ${(props) => props.theme.colorGrey5};
    }
    
    .todo-panel-body-line-description {
        width: 100%;
        height: 100px;
        display: flex;
        border-top: 1px solid ${(props) => props.theme.colorGrey4};
        transition: display 0.35s ease-out;
        padding-top: 10px;
        padding-bottom: 10px;
        position: relative;

        .todo-panel-body-line-description-text {
            padding-left: 10px;
        }

        .todo-panel-body-line-footer {
            display: flex;
            align-items: center;
            gap: 1.2rem;
            position: absolute;
            bottom: 0;
            width: 100%;
            justify-content: right;
            padding-bottom: 10px;
            padding-right: 10px;

            >button {
                display: inline-flex;
                font-size: 16px;
                cursor: pointer;
                background-color: ${(props) => props.theme.borderColor2};
                box-shadow: ${(props) => props.theme.shadow7};
                border: 2px solid ${(props) => props.theme.borderColor2};
                height: fit-content;
                border-radius: 7px;
                text-align: center;
                width: 70px;
                align-items: center;
                justify-content: center;
                padding-top: 5px;
                padding-bottom: 5px;
            }

            button:hover {
                border-color: #646cff;
                background-color: ${(props) => props.theme.colorGrey5};
                color: ${(props) => props.theme.colorGrey1};
                transition: all 0.35s ease-in-out;
                }
        }
    }
`;

export default TodoLine;

