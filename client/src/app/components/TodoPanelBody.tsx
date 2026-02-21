import styled from "styled-components";
import themes from '../utils/themes';
import TodoLine from "./TodoLine";

//Todo: should we define a Todo object as a type?
interface Props {
    todos: Array<object>;
}

function TodoPanelBody({todos}: Props) {

    return (
        <TodoPanelBodyStyled>
            {
                todos && todos.map((todo) => (<TodoLine todoItem={todo}/>))
            }
        </TodoPanelBodyStyled>
    )

}

const TodoPanelBodyStyled = styled.div`

`;

export default TodoPanelBody;