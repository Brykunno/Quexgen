import { Tag, Users, Settings, LibraryBig , LayoutGrid,Logs,BookOpenCheck  } from "lucide-react";

export function getInstructorMenuList(pathname) {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
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
          href: "/create_exam",
          label: "Create Exam",
          icon: BookOpenCheck
        },
        {
          href: "/exams",
          label: "Exams",
          icon: LibraryBig
        },
        // {
        //   href: "/admin/logs",
        //   label: "Logs",
        //   icon: Logs
        // }
      ]
    },
    {
      groupLabel: "",
      menus: [
        // {
        //   href: "/admin/users",
        //   label: "Users",
        //   icon: Users
        // },
        {
          href: "/admin/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
