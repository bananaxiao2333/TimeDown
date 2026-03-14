import { Box, useTheme, Typography, Paper, useMediaQuery } from "@mui/material";
import { useState, useEffect, useRef } from "react";

const Home = () => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // Default: 1 hour in seconds

  // Format time for display (HH:MM:SS)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle click to toggle fullscreen mode
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerSx = isFullscreen
    ? {
        p: { xs: 2, md: 3 },
        maxWidth: "1440px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }
    : {
        p: { xs: 2, md: 3 },
        maxWidth: "1440px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      };

  const timerSx = isFullscreen
    ? {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        p: { xs: 4, md: 8 },
        textAlign: "center",
        "&:hover": {
          bgcolor: theme.palette.grey[100],
        },
      }
    : {
        width: { xs: "90%", sm: "70%", md: "50%" },
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        p: 4,
        textAlign: "center",
        boxShadow: theme.shadows[3],
      };

  return <></>;
};

export default Home;
