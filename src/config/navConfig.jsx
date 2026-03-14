import HomeIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import Display from "../pages/Display";
import Schedule from "../pages/Schedule";
import Settings from "../pages/Settings";
import About from "../pages/About";

// Unified configuration that combines navigation and routing information
export const APP_ROUTES = [
  {
    key: "display",
    text: "Display",
    icon: <HomeIcon />,
    path: "/display",
    component: <Display />,
  },
  {
    key: "schedule",
    text: "Schedule",
    icon: <CalendarTodayIcon />,
    path: "/schedule",
    component: <Schedule />,
  },
  {
    key: "settings",
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
    component: <Settings />,
  },
  {
    key: "about",
    text: "About",
    icon: <InfoIcon />,
    path: "/about",
    component: <About />,
  },
];

// Derived configurations for backward compatibility
export const NAV_CONFIG = APP_ROUTES.map((route) => ({
  key: route.key,
  text: route.text,
  icon: route.icon,
  path: route.path,
}));

export const ROUTE_CONFIG = APP_ROUTES.map((route) => ({
  key: route.key,
  path: route.path,
  component: route.component,
}));