import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/dashboard",
    },
    {
        title: "Teachers",
        icon: <AccountCircleIcon />,
        link: "/teachers",
    },

    {
        title: "Exams",
        icon: <ArticleIcon />,
        link: "/exams",
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


