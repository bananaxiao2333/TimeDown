// src/App.jsx
import { useMemo, useEffect, useRef } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  useMediaQuery,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// Add use-local-storage-state hook for theme persistence
import useLocalStorageState from "use-local-storage-state";

// 导入主题配置
import { lightTheme, darkTheme } from "./theme";
// 导入统一配置
import { NAV_CONFIG, ROUTE_CONFIG } from "./config/navConfig";
// 导入底部导航组件
import BottomNav from "./components/BottomNav";
import ErrorBoundary from "./components/ErrorBoundary";

const DRAWER_WIDTH = 240;
// 固定AppBar高度（MUI默认Toolbar高度为64px）
const APP_BAR_HEIGHT = 64;
// 移动端底部导航高度
const BOTTOM_NAV_HEIGHT = 64;

const App = () => {
  // Use use-local-storage-state hook for theme preference with timedown_ prefix
  const [isDarkMode, setIsDarkMode] = useLocalStorageState("timedown_theme", {
    defaultValue: false,
    // Ensure boolean type safety
    deserializer: (value) => {
      try {
        if (value === null || value === undefined) return false;
        if (typeof value === "boolean") return value;
        if (typeof value === "string") return value === "true";
        return Boolean(value);
      } catch (e) {
        console.warn("Failed to parse theme preference, using default:", e);
        return false;
      }
    },
    serializer: (value) => String(value),
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(currentTheme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);

  // Close PiP when route changes
  useEffect(() => {
    const currentPathname = location.pathname;
    const previousPathname = prevPathnameRef.current;

    // Only close PiP if we're actually navigating between different pages
    if (currentPathname !== previousPathname) {
      try {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
        }
      } catch (err) {
        console.error("Error closing PiP on route change:", err);
      }
    }

    // Update previous pathname ref
    prevPathnameRef.current = currentPathname;
  }, [location.pathname]);

  const navValue = useMemo(() => {
    const currentPath = location.pathname;
    const currentNav = NAV_CONFIG.find((item) => item.path === currentPath);
    return currentNav ? currentNav.key : "home";
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleBottomNavChange = (e, newValue) => {
    const targetNav = NAV_CONFIG.find((item) => item.key === newValue);
    if (targetNav) {
      handleNavClick(targetNav.path);
    }
  };

  const renderDrawerMenu = () => {
    return (
      <List style={{ userSelect: "none" }}>
        {NAV_CONFIG.map((item) => (
          <ListItem
            key={item.key}
            button
            onClick={() => handleNavClick(item.path)}
            selected={navValue === item.key}
            sx={{
              "&.Mui-selected": {
                bgcolor: currentTheme.palette.primary.light + "20",
                color: currentTheme.palette.primary.main,
              },
              "&:hover": {
                bgcolor: currentTheme.palette.primary.light + "10",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  navValue === item.key
                    ? currentTheme.palette.primary.main
                    : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <ThemeProvider theme={currentTheme}>
      {/* 关键修改1：最外层容器使用min-height而非height，避免强制固定高度 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: "100vh", // 改为min-height，允许内容超出时自动扩展
          height: "100%", // 兜底高度
        }}
      >
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            width: isMobile ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,
            ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
            bgcolor: currentTheme.palette.primary.main,
            zIndex: currentTheme.zIndex.drawer + 1,
            boxShadow: currentTheme.shadows[2],
            height: APP_BAR_HEIGHT, // 明确AppBar高度
          }}
        >
          <Toolbar sx={{ height: "100%" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 600 }}
            >
              TimeDown
            </Typography>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                borderRadius: "50%",
                bgcolor: currentTheme.palette.primary.light + "20",
                "&:hover": {
                  bgcolor: currentTheme.palette.primary.light + "40",
                },
              }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* 桌面端侧边栏 */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              bgcolor: currentTheme.palette.background.paper,
              boxShadow: currentTheme.shadows[1],
              height: "100vh", // 侧边栏占满视口高度
            }}
            aria-label="main navigation"
          >
            <Drawer
              variant="permanent"
              sx={{
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: DRAWER_WIDTH,
                  bgcolor: currentTheme.palette.background.paper,
                  boxShadow: currentTheme.shadows[1],
                  height: "100%", // 抽屉高度自适应
                },
              }}
              open
            >
              <Box sx={{ height: "100%" }}>
                <Toolbar
                  sx={{
                    borderBottom: `1px solid ${currentTheme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: currentTheme.palette.primary.main,
                      fontWeight: 600,
                    }}
                  ></Typography>
                </Toolbar>
                <Divider
                  sx={{ bgcolor: currentTheme.palette.divider + "50" }}
                />
                {renderDrawerMenu()}
              </Box>
            </Drawer>
          </Box>
        )}

        {/* 关键修改2：主内容区域高度计算优化 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: isMobile ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,
            // 精准计算顶部/底部边距，避免高度溢出
            mt: `${APP_BAR_HEIGHT}px`, // 改为固定像素值，匹配AppBar高度
            mb: isMobile ? `${BOTTOM_NAV_HEIGHT}px` : 0, // 移动端底部留出导航高度
            // 关键：移除height: '100vh'，改为height: '100%'
            height: "100%",
            // 仅在内容超出时显示滚动条
            overflow: "auto",
            bgcolor: currentTheme.palette.background.default,
            boxSizing: "border-box", // 内边距计入宽度/高度计算
          }}
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/about" />} />
              {ROUTE_CONFIG.map((item) => (
                <Route
                  key={item.key}
                  path={item.path}
                  element={item.component}
                />
              ))}
              <Route
                path="*"
                element={
                  <Typography
                    variant="h5"
                    sx={{ color: currentTheme.palette.text.primary }}
                  >
                    404
                  </Typography>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Box>

        {/* 移动端底部导航 */}
        {isMobile && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: BOTTOM_NAV_HEIGHT,
              zIndex: currentTheme.zIndex.appBar, // 确保层级正确
            }}
          >
            <BottomNav
              value={navValue}
              onChange={handleBottomNavChange}
              theme={currentTheme}
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
