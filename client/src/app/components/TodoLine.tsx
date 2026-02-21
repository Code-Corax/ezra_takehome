import styled from "styled-components";
import themes from '../utils/themes';

//Todo: should we define a Todo object as a type?
interface Props {
    todoItem: object;
}

function TodoLine({todoItem}: Props) {

    //todo: make this swappable for themes
    const theme = themes[0];

    return (
        <TodoLineStyled theme={theme}>
            <div className="todo-line">
                {JSON.stringify(todoItem)}
            </div>
        </TodoLineStyled>
    );
}

const TodoLineStyled = styled.div`
    margin: 10px 5px;
    border-top: 2px solid ${(props) => props.theme.borderColor2};
`;

export default TodoLine;