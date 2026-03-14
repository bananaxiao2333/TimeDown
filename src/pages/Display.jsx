import { Box, Typography, useTheme, Fab, Zoom } from "@mui/material";
import { useState, useEffect, useRef } from "react";
// Fix cron-parser import - use default export for v4.9.0
import cronParser from "cron-parser";
// Add use-local-storage-state hook
import useLocalStorageState from "use-local-storage-state";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PictureInPictureIcon from "@mui/icons-material/PictureInPicture";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";

const Display = () => {
  const theme = useTheme();
  const [nextEvent, setNextEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const containerRef = useRef(null);
  const pipVideoRef = useRef(null);
  const pipCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  // Add refs to hold current state values for the animation loop
  const nextEventRef = useRef(null);
  const timeLeftRef = useRef(null);

  // Update refs whenever state changes
  useEffect(() => {
    nextEventRef.current = nextEvent;
  }, [nextEvent]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Use use-local-storage-state hook for settings
  const [settings] = useLocalStorageState("timedown_settings", {
    defaultValue: {
      alignment: { horizontal: "center", vertical: "center" },
      fontSize: {
        countdown: 48,
        eventName: 36,
        exactTime: 24,
      },
      display: { time: true, name: true, exactTime: true },
    },
  });

  // Helper function to find next occurrence of a cron event
  const getNextCronOccurrence = (cronExpression) => {
    try {
      // Parse the cron expression with current date as reference
      // Use parseExpression for v4.9.0
      const interval = cronParser.parseExpression(cronExpression);

      // Get the next occurrence
      const next = interval.next();
      return next.toDate();
    } catch (e) {
      console.error("Error parsing cron expression:", cronExpression, e);
      return null;
    }
  };

  // Find next event (only recurring events with cron, since BaseTime is removed)
  const findNextEvent = () => {
    const eventsStr = localStorage.getItem("timedown_events");
    if (!eventsStr) return null;

    try {
      const events = JSON.parse(eventsStr);
      if (!Array.isArray(events) || events.length === 0) return null;

      const now = new Date();
      let nextEvent = null;
      let nextTime = null;

      for (const event of events) {
        try {
          if (event.cron && event.cron.trim() !== "") {
            // Handle recurring events with cron (no BaseTime anymore)
            const nextCronTime = getNextCronOccurrence(event.cron.trim());
            if (nextCronTime && nextCronTime > now) {
              if (!nextTime || nextCronTime < nextTime) {
                nextTime = nextCronTime;
                nextEvent = { ...event, nextTime: nextCronTime };
              }
            }
          }
        } catch (e) {
          console.error("Error processing event:", event, e);
          continue;
        }
      }

      return nextEvent;
    } catch (e) {
      console.error("Error parsing events:", e);
      return null;
    }
  };

  // Calculate time left in seconds
  const calculateTimeLeft = (targetTime) => {
    if (!targetTime) return null;
    const now = new Date();
    const diff = targetTime - now;
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  };

  // Format time as DD:HH:MM:SS
  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00:00";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Request fullscreen
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
        );
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Render content to canvas with 16:9 aspect ratio - independent of DOM
  const renderContentToCanvas = (canvas, ctx) => {
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get current event and time data from refs (not state directly)
    const currentEvent = nextEventRef.current;
    const currentTimeLeft = timeLeftRef.current;

    // Fill background
    const bgColor = currentEvent?.bgColor || theme.palette.background.default;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Set text color
    const textColor = currentEvent?.textColor || theme.palette.text.primary;
    ctx.fillStyle = textColor;

    // Calculate text positions based on alignment
    const textAlign = settings.alignment.horizontal;
    let textX;
    if (textAlign === "left") textX = width * 0.1;
    else if (textAlign === "right") textX = width * 0.9;
    else textX = width / 2;

    ctx.textAlign = textAlign;
    ctx.textBaseline = "middle";

    let currentY = height * 0.3; // Start at 30% height

    // Render countdown time - Use larger base font sizes for PiP
    if (settings.display.time && currentTimeLeft !== null) {
      // For PiP (640x360), use larger relative font sizes
      const fontSize = Math.min(
        settings.fontSize.countdown * (width / 800),
        width * 0.25,
      ); // Increased from /1200 to /800 and 0.2 to 0.25
      ctx.font = `bold ${Math.max(fontSize, 32)}px Arial`; // Increased min from 24 to 32
      ctx.fillText(formatTime(currentTimeLeft), textX, currentY);
      currentY += fontSize + 20;
    }

    // Render event name - Use larger base font sizes for PiP
    if (settings.display.name && currentEvent) {
      const fontSize = Math.min(
        settings.fontSize.eventName * (width / 800),
        width * 0.2,
      ); // Increased from /1200 to /800 and 0.15 to 0.2
      ctx.font = `bold ${Math.max(fontSize, 24)}px Arial`; // Increased min from 18 to 24
      ctx.fillText(currentEvent.name, textX, currentY);
      currentY += fontSize + 20;
    }

    // Render exact time - Use larger base font sizes for PiP
    if (settings.display.exactTime && currentEvent) {
      const fontSize = Math.min(
        settings.fontSize.exactTime * (width / 800),
        width * 0.15,
      ); // Increased from /1200 to /800 and 0.1 to 0.15
      ctx.font = `bold ${Math.max(fontSize, 18)}px Arial`; // Increased min from 14 to 18
      ctx.fillText(
        currentEvent.nextTime?.toLocaleString() || "",
        textX,
        currentY,
      );
    }

    // Handle no events case
    if (!currentEvent) {
      const fontSize = Math.min(
        settings.fontSize.eventName * (width / 800),
        width * 0.2,
      ); // Increased from /1200 to /800 and 0.15 to 0.2
      ctx.font = `bold ${Math.max(fontSize, 24)}px Arial`; // Increased min from 18 to 24
      ctx.fillText("No scheduled events", textX, height / 2);
    }
  };

  // Initialize PiP canvas with 16:9 aspect ratio
  const initializePipCanvas = () => {
    if (!pipCanvasRef.current) return;

    const canvas = pipCanvasRef.current;
    // Set 16:9 aspect ratio (common resolution: 640x360)
    const width = 640;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    renderContentToCanvas(canvas, ctx);
  };

  // Update canvas continuously
  const updateCanvasLoop = () => {
    if (pipCanvasRef.current) {
      const canvas = pipCanvasRef.current;
      const ctx = canvas.getContext("2d");
      renderContentToCanvas(canvas, ctx);
    }
    animationFrameRef.current = requestAnimationFrame(updateCanvasLoop);
  };

  // Toggle Picture-in-Picture mode
  const togglePictureInPicture = async () => {
    if (!pipVideoRef.current || !pipCanvasRef.current) return;

    try {
      if (!isPipActive) {
        // Initialize canvas with 16:9 aspect ratio
        initializePipCanvas();

        // Create media stream from canvas
        const stream = pipCanvasRef.current.captureStream(30); // 30 FPS

        // Set stream to video element
        pipVideoRef.current.srcObject = stream;
        await pipVideoRef.current.play();

        // Request Picture-in-Picture IMMEDIATELY (must be in user gesture context)
        // Don't wait for metadata - request PiP right away
        await pipVideoRef.current.requestPictureInPicture();
        setIsPipActive(true);

        // Start continuous updates
        updateCanvasLoop();
      } else {
        // Exit PiP
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
        setIsPipActive(false);

        // Stop animation loop
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
    } catch (err) {
      console.error("Picture-in-Picture failed:", err);
      alert(`PiP Error: ${err.message}`);
    }
  };

  // Handle PiP exit events
  useEffect(() => {
    const handlePipExit = () => {
      setIsPipActive(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    document.addEventListener("leavepictureinpicture", handlePipExit);
    return () => {
      document.removeEventListener("leavepictureinpicture", handlePipExit);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Check PiP support
  const isPipSupported =
    "pictureInPictureEnabled" in document && document.pictureInPictureEnabled;

  // Poll for updates
  useEffect(() => {
    const updateNextEvent = () => {
      const event = findNextEvent();
      setNextEvent(event);

      if (event) {
        const timeLeftSecs = calculateTimeLeft(event.nextTime);
        setTimeLeft(timeLeftSecs);
      } else {
        setTimeLeft(null);
      }
    };

    // Initial load
    updateNextEvent();

    // Poll every second
    const interval = setInterval(updateNextEvent, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine alignment styles
  const getAlignmentStyle = () => {
    const horizontalMap = {
      left: "flex-start",
      center: "center",
      right: "flex-end",
    };
    const verticalMap = {
      top: "flex-start",
      center: "center",
      bottom: "flex-end",
    };

    return {
      justifyContent: verticalMap[settings.alignment.vertical] || "center",
      alignItems: horizontalMap[settings.alignment.horizontal] || "center",
    };
  };

  // Container styles based on mode
  const getContainerSx = () => {
    if (isFullscreen) {
      // Fullscreen mode uses full viewport with actual content
      return {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        ...getAlignmentStyle(),
        bgcolor: nextEvent?.bgColor || theme.palette.background.default,
        color: nextEvent?.textColor || theme.palette.text.primary,
        p: 2,
        boxSizing: "border-box",
        margin: 0,
        overflow: "hidden",
      };
    } else {
      // Normal and PiP modes use constrained size with actual content
      return {
        width: "100%",
        maxWidth: "1200px",
        height: "100%",
        maxHeight: "800px",
        display: "flex",
        flexDirection: "column",
        ...getAlignmentStyle(),
        bgcolor: nextEvent?.bgColor || theme.palette.background.default,
        color: nextEvent?.textColor || theme.palette.text.primary,
        p: 2,
        boxSizing: "border-box",
        margin: "0 auto",
        overflow: "hidden",
      };
    }
  };

  const countdownStyle = {
    fontSize: `${settings.fontSize.countdown}px`,
    fontWeight: "bold",
    textAlign: settings.alignment.horizontal,
    mb: 1,
  };

  const eventNameStyle = {
    fontSize: `${settings.fontSize.eventName}px`,
    fontWeight: "bold",
    textAlign: settings.alignment.horizontal,
    mb: 1,
  };

  const exactTimeStyle = {
    fontSize: `${settings.fontSize.exactTime}px`,
    fontWeight: "bold",
    textAlign: settings.alignment.horizontal,
    mb: 1,
  };

  // Determine what to display based on mode
  const renderContent = () => {
    if (!nextEvent) {
      return (
        <Typography variant="h4" sx={eventNameStyle}>
          No scheduled events
        </Typography>
      );
    }

    return (
      <>
        {settings.display.time && timeLeft !== null && (
          <Typography variant="h2" sx={countdownStyle} component="div">
            {formatTime(timeLeft)}
          </Typography>
        )}
        {settings.display.name && (
          <Typography variant="h4" sx={eventNameStyle}>
            {nextEvent.name}
          </Typography>
        )}
        {settings.display.exactTime && (
          <Typography variant="h6" sx={exactTimeStyle}>
            {nextEvent.nextTime.toLocaleString()}
          </Typography>
        )}
      </>
    );
  };

  return (
    <>
      <Box ref={containerRef} sx={getContainerSx()}>
        {renderContent()}
        {/* Floating buttons - only show in normal mode */}
        {!isPipActive && !isFullscreen && (
          <>
            <Zoom
              in={!isFullscreen}
              style={{ position: "fixed", bottom: 96, right: 16 }}
            >
              <Fab
                color="primary"
                onClick={toggleFullscreen}
                aria-label="fullscreen"
              >
                <FullscreenIcon />
              </Fab>
            </Zoom>
            <Zoom
              in={isPipSupported}
              style={{ position: "fixed", bottom: 160, right: 16 }}
            >
              <Fab
                color="secondary"
                onClick={togglePictureInPicture}
                aria-label="picture in picture"
              >
                <PictureInPictureIcon />
              </Fab>
            </Zoom>
          </>
        )}
        {/* Exit buttons - show when in respective modes */}
        {isFullscreen && (
          <Zoom in style={{ position: "fixed", bottom: 96, right: 16 }}>
            <Fab
              color="secondary"
              onClick={toggleFullscreen}
              aria-label="exit fullscreen"
            >
              <FullscreenExitIcon />
            </Fab>
          </Zoom>
        )}
        {isPipActive && (
          <Zoom in style={{ position: "fixed", bottom: 160, right: 16 }}>
            <Fab
              color="warning"
              onClick={togglePictureInPicture}
              aria-label="exit picture in picture"
            >
              <PictureInPictureAltIcon />
            </Fab>
          </Zoom>
        )}
      </Box>
      {/* Hidden elements for PiP - dedicated canvas with 16:9 aspect ratio */}
      <canvas ref={pipCanvasRef} style={{ display: "none" }} />
      <video ref={pipVideoRef} muted autoPlay style={{ display: "none" }} />
    </>
  );
};

export default Display;
