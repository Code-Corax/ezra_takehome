import styled from "styled-components";
import sidePanelItems from '../utils/sidePanelItems';
import { CheckIcon, ClipboardDocumentListIcon, ExclamationCircleIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import type { JSX } from "react";
import type { TodoFilter } from "../utils/TodoFilter";

const icons: { [key: string]: JSX.Element } = {
    "checkicon": <CheckIcon className="h-6 w-6 text-gray-500" />,
    "clipboard": <ClipboardDocumentListIcon className="h-6 w-6 text-gray-500" />,
    "exclamation": <ExclamationCircleIcon className="h-6 w-6 text-gray-500" />,
    "stack": <Square2StackIcon className="h-6 w-6 text-gray-500" />
}

type Props = {
        activeFilter: TodoFilter;
        onSelectFilter: (filter: TodoFilter) => void;
    };

function SidePanel({activeFilter, onSelectFilter}: Props) {

    return( 
        <SidePanelStyled>
            <ul className="nav-items">
                {sidePanelItems.map((item) => {
                    return (
                        <li key={item.title} className={`nav-item ${activeFilter === item.filter ? "is-active" : ""}`}>
                            <button className={`nav-item-button`} onClick={() => onSelectFilter(item.filter)}>
                                {icons[item.icon]}
                                <div className="nav-item-button-title">{item.title}</div>
                            </button>
                            
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
    border-radius: 0 1rem 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${(props) => props.theme.colorGrey3};
    

    .nav-items {
        margin-top: 25px;
    }

    .nav-item {
        font-size: 20px;
        cursor: pointer;
        position: relative;

        button {
            height: 100%;
            width: 100%;
            padding: 10px;
        }
    }

    .nav-item.is-active {
        background-color: ${(props) => props.theme.colorGrey5};
        color: ${(props) => props.theme.colorGrey1};
        border-color: ${(props) => props.theme.colorPrimaryGreen};
        box-shadow: ${(props) => props.theme.shadow7};
        font-weight: 600;
    }

    .nav-item.is-active::after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        bottom: 6px;
        width: 4px;
        border-radius: 999px;
        background-color: ${(props) => props.theme.colorPrimaryGreen};
        z-index: 1;
        height: 100%;
    }

    .nav-item:hover {
        border-color: #646cff;
        background-color: ${(props) => props.theme.colorGrey4};
        color: ${(props) => props.theme.colorGrey1};
        transition: all 0.3s ease-in-out;
    }

    .nav-item-button {
        display: flex;
        align-items: center;
        position: relative;
        border-radius: 10px;
        padding: 10px 12px;

        .nav-item-button-title {
            padding-left: 8px;
        }
    }
`;

export default SidePanel;