import styled from "styled-components";
import themes from '../utils/themes';

//Todo: should we define a Todo object as a type?
interface Props {
}

function TodoPanelHeader() {

    //todo: make this swappable for themes
    const theme = themes[0];

    return (
        <TodoPanelHeaderStyled theme={theme}>
            <div className="header-area">
                <h1>Tasks</h1>
            </div>
        </TodoPanelHeaderStyled>
    )

}

const TodoPanelHeaderStyled = styled.div`
    .header-area {
        height: 60px;
    }
        
    .header-area h1 {
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 800;
        position: relative;
        line-height: 100%;

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
`;

export default TodoPanelHeader