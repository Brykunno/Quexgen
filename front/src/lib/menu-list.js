import { Tag, Users, Settings, LibraryBig , LayoutGrid,Logs,BookOpenCheck  } from "lucide-react";

export function getMenuList(pathname) {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        // {
        //   href: "",
        //   label: "Posts",
        //   icon: SquarePen,
        //   submenus: [
        //     {
        //       href: "/posts",
        //       label: "All Posts"
        //     },
        //     {
        //       href: "/posts/new",
        //       label: "New Post"
        //     }
        //   ]
        // },
        
        {
          href: "/admin/exams",
          label: "Exams",
          icon: BookOpenCheck
        },
        {
          href: "/admin/courses",
          label: "Courses",
          icon: LibraryBig
        },
        {
          href: "/admin/logs",
          label: "Logs",
          icon: Logs
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/admin/users",
          label: "Users",
          icon: Users
        },
        {
          href: "/admin/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
