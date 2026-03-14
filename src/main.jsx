import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import Watermark from "@uiw/react-watermark";
import icon from "./icon.png";
import { useTheme } from "@mui/material";

// 开屏动画组件（实现：全屏背板收缩到中间10px高度的线）
const SplashScreen = () => {
  const [animationStage, setAnimationStage] = useState(0);

  // 精准控制动画时序
  useEffect(() => {
    // 阶段0: 初始显示（0.5秒后进入阶段1）
    const stage1Timer = setTimeout(() => setAnimationStage(1), 500);

    // 阶段1: 背板缩成居中10px高度的线（1秒后进入阶段2，总时长1.5秒）
    const stage2Timer = setTimeout(() => setAnimationStage(2), 1000);

    // 阶段2: 居中细线向中间收缩消失（0.8秒后进入阶段3，总时长2.3秒）
    const stage3Timer = setTimeout(() => setAnimationStage(3), 1200);

    // 阶段3: 图标渐隐（1秒后销毁组件，总时长3.3秒）
    const destroyTimer = setTimeout(() => setAnimationStage(4), 1500);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(destroyTimer);
    };
  }, []);

  if (animationStage === 4) return null;

  // 自定义图标（添加固定尺寸，避免变形）
  const AppIcon = () => (
    <img
      src={icon}
      style={{ width: "260px", height: "260px", objectFit: "contain" }}
      alt="TimeDown icon"
    />
  );

  const theme = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        display: animationStage < 4 ? "flex" : "none",
      }}
    >
      {/* 背板 - 核心修改：全屏收缩到中间10px高度的线，再向中间收缩消失 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: theme.palette.primary.main,
          // 阶段1：收缩为中间10px高度的线
          height: animationStage >= 1 ? "10px" : "100%",
          top: animationStage >= 1 ? "calc(50% - 5px)" : "0", // 居中（10px高度的线，top偏移5px）
          // 阶段2：细线向中间收缩消失
          width: animationStage >= 2 ? "0%" : "100%",
          left: animationStage >= 2 ? "50%" : "0",
          // 动画过渡：分阶段控制
          transition:
            animationStage >= 2
              ? "width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              : animationStage >= 1
                ? "height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
        }}
      ></div>

      {/* 图标 - 居中显示，独立动画 */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          opacity: animationStage >= 3 ? 0 : 1,
          transition: "opacity 1s ease-out",
        }}
      >
        <AppIcon />
      </div>

      {/* 全局样式重置 */}
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </div>
  );
};

// 根渲染逻辑
createRoot(document.getElementById("root")).render(
  <Watermark content="TimeDown">
    <StrictMode>
      <HashRouter>
        <SplashScreen />
        <App />
      </HashRouter>
    </StrictMode>
  </Watermark>,
);
