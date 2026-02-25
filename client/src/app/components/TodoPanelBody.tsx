import styled from "styled-components";
import TodoLine from "./TodoLine";
import type { Todo } from "../api/todoApiModels";
import { CheckIcon } from "@heroicons/react/24/outline";


interface Props {
    todos: Array<Todo>;
    updateTodoModalOpener: (toUpdate: Todo) => void
}

function TodoPanelBody({todos, updateTodoModalOpener}: Props) {

    return (
        <TodoPanelBodyStyled>
            <div className="todo-panel-body-header">
                <div className="todo-panel-body-header-is-done"><CheckIcon className="h-6 w-6 text-gray-500" /></div>
                <div className="todo-panel-body-header-priorty">Rank</div>
                <div className="todo-panel-body-header-title">Name</div>
                <div className="todo-panel-body-header-date-created">Created</div>
            </div>
            <div className="todo-panel-body-list">
                {
                    todos && todos.map((todo) => (<TodoLine key={todo.id} todoItem={todo} updateTodoModalOpener={updateTodoModalOpener}/>))
                }
            </div>
        </TodoPanelBodyStyled>
    )

}

const TodoPanelBodyStyled = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;

    .todo-panel-body-header {
        display: flex;
        align-items: center;
        height: 45px;

        .todo-panel-body-header-is-done {
            width: 6%;
            border-right: 2px solid ${(props) => props.theme.borderColor2};
            padding-left: 10px;
        }
        .todo-panel-body-header-priorty {
            width: 10%;
            border-right: 2px solid ${(props) => props.theme.borderColor2};
            padding-left: 10px;
        }
        .todo-panel-body-header-title {
            width: 64%;
            border-right: 2px solid ${(props) => props.theme.borderColor2};
            padding-left: 10px;
        }
        .todo-panel-body-header-date-created {
            width: 20%;
            padding-left: 10px;
        }
    }

    .todo-panel-body-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* WebKit */
        .todo-panel-body-list::-webkit-scrollbar {
        width: 10px;
    }

    .todo-panel-body-list::-webkit-scrollbar-track {
        background: transparent;
    }

    .todo-panel-body-list::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.colorGrey4};
        border-radius: 999px;
        border: 2px solid transparent;
        background-clip: content-box;
    }

    .todo-panel-body-list::-webkit-scrollbar-thumb:hover {
        background-color: ${(props) => props.theme.colorGrey3};
    }

`;

export default TodoPanelBody;