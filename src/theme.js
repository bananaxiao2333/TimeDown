import { createTheme } from '@mui/material/styles';

// 亮色主题（主色#1976D2，次要色#0D47A1）
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2', // 主色：蓝色
      light: '#42A5F5', // 浅主色（hover/选中态）
      dark: '#1565C0',  // 深主色（阴影/边框）
    },
    secondary: {
      main: '#0D47A1', // 次要色：深蓝色
      light: '#5472D3',
      dark: '#0A3D8A',
    },
    error: {
      main: '#F53F3F', // 危险红（保留反诈警示）
    },
    success: {
      main: '#00B42A', // 安全绿（辅助）
    },
    info: {
      main: '#86909C', // 中性灰
    },
    background: {
      default: '#F7F8FA', // 浅灰背景
      paper: '#FFFFFF',    // 卡片白色
    },
    text: {
      primary: '#1D2129', // 主文本色
      secondary: '#4E5969', // 次要文本色
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8, // 现代圆角
  },
  shadows: [
    'none',
    '0 2px 8px rgba(25, 118, 210, 0.08)',
    '0 4px 16px rgba(25, 118, 210, 0.12)',
    '0 8px 24px rgba(25, 118, 210, 0.16)',
    ...Array(20).fill('0 4px 20px rgba(0, 0, 0, 0.05)'),
  ],
});

// 暗色主题（背景深灰色#1E1E1E，避免纯黑）
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976D2', // 主色保持一致
      light: '#42A5F5',
      dark: '#1565C0',
    },
    secondary: {
      main: '#0D47A1', // 次要色保持一致
      light: '#5472D3',
      dark: '#0A3D8A',
    },
    error: {
      main: '#FF4D4F', // 危险红（暗调）
    },
    success: {
      main: '#00C48C', // 安全绿（暗调）
    },
    background: {
      default: '#1E1E1E', // 深灰色背景（避免纯黑）
      paper: '#2D2D2D',   // 卡片深灰
    },
    text: {
      primary: '#F8FAFC', // 主文本白
      secondary: '#CBD5E1', // 次要文本浅灰
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.3)',
    '0 8px 24px rgba(0, 0, 0, 0.4)',
    ...Array(20).fill('0 4px 20px rgba(0, 0, 0, 0.15)'),
  ],
});