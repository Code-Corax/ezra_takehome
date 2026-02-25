import type { TodoFilter } from "./TodoFilter";

export type SidePanelItem = {
    id: number,
    title: string;
    icon: "checkicon" | "clipboard" | "exclamation" | "stack";
    filter: TodoFilter;
  };

const sidePanelItems: SidePanelItem[] = [
  {
    id: 1,
    title: "All Tasks",
    icon: "checkicon",
    filter: "all"
  },
  {
    id: 2,
    title: "Incomplete",
    icon: "stack",
    filter: "incomplete"
  },
  {
    id: 3,
    title: "Completed",
    icon: "clipboard",
    filter: "complete"
  },
  {
    id: 4,
    title: "High Priority",
    icon: "exclamation",
    filter: "highPriority"
  }
];

export default sidePanelItems;