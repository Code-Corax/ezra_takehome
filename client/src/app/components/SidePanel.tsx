import styled from "styled-components";
import sidePanelItems from '../utils/sidePanelItems';
import themes from '../utils/themes';

function SidePanel() {

    //todo: make this swappable for themes
    const theme = themes[0];

    return( 
        <SidePanelStyled theme={theme}>

            <ul className="nav-items">
                {sidePanelItems.map((item) => {
                    return (
                        <li key={item.title} className={`nav-item`}>
                            {/* {item.icon} */}
                            {/* <Link href={link}>{item.title}</Link>  */}
                            {item.title}
                        </li>
                    )
                })}
            </ul>
        </SidePanelStyled >
    );

}

const SidePanelStyled = styled.nav<{$collapsed?: boolean;}> `
    position: relative;
    width: ${(props) => props.theme.sidebarWidth};
    background-color: ${(props) => props.theme.colorBg2};
    border: 2px solid ${(props) => props.theme.borderColor2};
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${(props) => props.theme.colorGrey3};
`;

export default SidePanel;