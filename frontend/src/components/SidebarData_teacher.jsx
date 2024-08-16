import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

export const SidebarData_teacher = [
    // {
    //     title: "Dashboard",
    //     icon: <DashboardIcon />,
    //     link: "/dashboard",
    // },

    {
        title: "Create Exam",
        icon: <ArticleIcon />,
        link: "/create_exam",
    },
    {
        title: "Exam Bank",
        icon: <FolderCopyIcon />,
        link: "/exam_bank",
    },
    {
        title: "TOS",
        icon: <FolderCopyIcon />,
        link: "/tos_view",
    },
    {
        title: "Profile",
        icon: <ManageAccountsIcon />,
        link: "/",
    },
    {
        title: "Logout",
        icon: <LogoutIcon />,
        link: "/logout",
    },



]


