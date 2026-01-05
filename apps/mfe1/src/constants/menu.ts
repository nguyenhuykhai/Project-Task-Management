import type { Group } from "@/types/menus";
import { Book, House, LayoutList, ShieldX } from "lucide-react";

export const getMenuList = (pathname: string): Group[] => {
  return [
    {
      groupLabel: "Host App",
      menus: [
        {
          href: "/",
          label: "Trang chủ",
          icon: House,
          active: pathname === "/",
          submenus: [],
        },
        {
          href: "/not-have-permission",
          label: "Không có quyền",
          icon: ShieldX,
          active: pathname === "/not-have-permission",
          submenus: [],
        },
        {
          href: "/docs",
          label: "Tài liệu",
          icon: Book,
          active: pathname === "/docs",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Micro App",
      menus: [
        {
          href: "/task-management",
          label: "Quản lý nhiệm vụ",
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
