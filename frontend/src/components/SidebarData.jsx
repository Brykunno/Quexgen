import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SettingsIcon from '@mui/icons-material/Settings';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/dashboard",
    },
    {
        title: "Instructors",
        icon: <AccountCircleIcon />,
        link: "/teachers",
    },
 
    {
        title: "Courses",
        icon: <SchoolIcon />,
        link: "/courses",
    },

    {
        title: "Exams",
        icon: <ArticleIcon />,
        link: "/exams",
        link2: "/exam_review"
    },

    {
        title: "Logs",
        icon: <WorkHistoryIcon />,
        link: "/logs",
        link2: "/logs"
    },

    {
        title: "Settings",
        icon: <SettingsIcon />,
        link: "/settings",
        link2: "/settings"
    },
   


    // {
    //     title: "Profile",
    //     icon: <ManageAccountsIcon />,
    //     link: "/profile_admin",
    // },
    {
        title: "Logout",
        icon: <LogoutIcon />,
        link: "/logout",
    },



]


