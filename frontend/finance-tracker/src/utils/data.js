import {
  LuLayoutGrid,
  LuArrowLeftRight,
  LuBrain,
  LuSettings,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutGrid,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Transactions",
    icon: LuArrowLeftRight,
    path: "/transactions",
  },
  {
    id: "03",
    label: "AI Insights",
    icon: LuBrain,
    path: "/ai-insights",
  },
  {
    id: "04",
    label: "Settings",
    icon: LuSettings,
    path: "/settings",
  },
];
