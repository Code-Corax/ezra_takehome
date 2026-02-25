import styled from "styled-components";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Props {
    createTodoModalOpener: () => void
}

function TodoPanelHeader({createTodoModalOpener}: Props) {

    return (
        <TodoPanelHeaderStyled>
            <h1>Tasks</h1>
            <div className='flex justify-end'>
                <button className="add-todo-button" onClick={() => createTodoModalOpener()}>
                    <PlusIcon className="h-6 w-6 text-gray-500" />
                    Add
                </button>
            </div>
        </TodoPanelHeaderStyled>
    )

}

const TodoPanelHeaderStyled = styled.div`
    height: 60px;
    display: flex;

    button {
        display: flex;
        font-size: 16px;
        cursor: pointer;
        background-color: ${(props) => props.theme.borderColor2};
        box-shadow: ${(props) => props.theme.shadow7};
        border: 2px solid ${(props) => props.theme.borderColor2};
        padding: 5px 15px 5px 10px;
        height: fit-content;
        border-radius: 7px;
    }

    button:hover {
        border-color: #646cff;
        background-color: ${(props) => props.theme.colorGrey5};
        color: ${(props) => props.theme.colorGrey1};
        transition: all 0.35s ease-in-out;
    }
        
    >h1 {
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 800;
        position: relative;
        line-height: 100%;
        width: 100%;
    }
`;

export default TodoPanelHeader