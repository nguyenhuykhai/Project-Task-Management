import type { Group } from "@/types/menus";
import { House, LayoutList, ShieldX } from "lucide-react";

export const getMenuList = (pathname: string): Group[] => {
  return [
    {
      groupLabel: "Host App",
      menus: [
        {
          href: "/",
          label: "Home",
          icon: House,
          active: pathname === "/",
          submenus: [],
        },
        {
          href: "/not-have-permission",
          label: "Not Have Permission",
          icon: ShieldX,
          active: pathname === "/not-have-permission",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Micro App",
      menus: [
        {
          href: "/task-management",
          label: "Task Management",
          icon: LayoutList,
          active: pathname === "/task-management",
          // Add submenus if needed
          // submenus: [
          //   {
          //     href: "/example-router",
          //     label: "Example Router",
          //   },
          // ],
        },
      ],
    },
  ];
};
