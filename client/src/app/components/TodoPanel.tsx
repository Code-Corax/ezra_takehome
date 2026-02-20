import styled from "styled-components";
import themes from '../utils/themes';

interface Props {
    todos: Array<object>;
}

function TodoPanel({todos}: Props) {

    //todo: make this swappable for themes
    const theme = themes[0];

    return (
        <TodoPanelStyled theme={theme}>
            <div className="header-area">
                <h1>Tasks</h1>
            </div>
            <div>{JSON.stringify(todos)}</div>
        </TodoPanelStyled>
    )

}

const TodoPanelStyled = styled.div`

    padding: 2rem;
    width: 100%;
    background-color: ${(props) => props.theme.colorBg2};
    border: 2px solid ${(props) => props.theme.borderColor2};
    border-radius: 1rem;
    overflow-y: auto;
    height: 100%;

    &::-webkit-scrollbar {
        width: 0.5rem;
    }

    .tasks {
        margin: 2rem 0;
    }
        
    .header-area h1 {
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 800;
        position: relative;

        &::after {
            content: "";
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            width: 3rem;
            height: 0.2rem;
            background-color: ${(props) => props.theme.colorPrimaryGreen}; 
            border-radius: 0.5rem;
        }
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