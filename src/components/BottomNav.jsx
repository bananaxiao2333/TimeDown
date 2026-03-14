// src/components/BottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Box, useTheme } from '@mui/material';
import { NAV_CONFIG } from '../config/navConfig'; // 导入统一配置

const BottomNav = ({ value, onChange }) => {
  const theme = useTheme();

  return (
    <BottomNavigation
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        bgcolor: 'background.paper',
        boxShadow: 2,
        zIndex: theme.zIndex.appBar - 1,
      }}
      value={value}
      onChange={onChange}
    >
      {/* 遍历统一配置生成导航项（现在是5个） */}
      {NAV_CONFIG.map((item) => (
        <BottomNavigationAction
          key={item.key}
          label={item.text}
          value={item.key}
          icon={item.icon}
        />
      ))}
    </BottomNavigation>
  );
};

export default BottomNav;