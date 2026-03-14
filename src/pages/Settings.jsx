import {
  Box,
  Typography,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  useTheme,
  Grid,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { saveAs } from "file-saver";
// Add use-local-storage-state hook
import useLocalStorageState from "use-local-storage-state";

const Settings = () => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Default settings structure
  const DEFAULT_SETTINGS = {
    alignment: { horizontal: "center", vertical: "center" },
    fontSize: {
      countdown: 48,
      eventName: 36,
      exactTime: 24,
    },
    display: { time: true, name: true, exactTime: true },
  };

  // Use use-local-storage-state hook for settings with validation
  const [settings, setSettings] = useLocalStorageState("timedown_settings", {
    defaultValue: DEFAULT_SETTINGS,
    serializer: {
      serialize: (value) => JSON.stringify(value),
      deserialize: (str) => {
        try {
          const parsed = JSON.parse(str);
          // Validate and ensure proper structure
          return {
            alignment: {
              horizontal: parsed?.alignment?.horizontal || "center",
              vertical: parsed?.alignment?.vertical || "center",
            },
            fontSize: {
              countdown:
                typeof parsed?.fontSize?.countdown === "number"
                  ? parsed.fontSize.countdown
                  : 48,
              eventName:
                typeof parsed?.fontSize?.eventName === "number"
                  ? parsed.fontSize.eventName
                  : 36,
              exactTime:
                typeof parsed?.fontSize?.exactTime === "number"
                  ? parsed.fontSize.exactTime
                  : 24,
            },
            display: {
              time: parsed?.display?.time ?? true,
              name: parsed?.display?.name ?? true,
              exactTime: parsed?.display?.exactTime ?? true,
            },
          };
        } catch (e) {
          console.warn(
            "Failed to parse settings from localStorage, using defaults",
          );
          return DEFAULT_SETTINGS;
        }
      },
    },
  });

  const handleAlignmentChange = (direction, value) => {
    setSettings((prev) => ({
      ...prev,
      alignment: { ...prev.alignment, [direction]: value },
    }));
  };

  const handleFontSizeChange = (field, newValue) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: { ...prev.fontSize, [field]: newValue },
    }));
  };

  const handleDisplayToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      display: { ...prev.display, [field]: !prev.display[field] },
    }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    showSnackbar("Settings reset to defaults", "success");
  };

  const exportData = () => {
    try {
      const events = localStorage.getItem("timedown_events") || "[]";
      const settingsData = localStorage.getItem("timedown_settings") || "{}";

      const exportData = {
        events: JSON.parse(events),
        settings: JSON.parse(settingsData),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, "timedown-config.json");
      showSnackbar("Configuration exported successfully", "success");
    } catch (e) {
      console.error("Export failed:", e);
      showSnackbar("Failed to export configuration", "error");
    }
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.events) {
          localStorage.setItem("timedown_events", JSON.stringify(data.events));
        }
        if (data.settings) {
          // The serializer will handle validation automatically when we set it
          setSettings(data.settings);
        }

        showSnackbar("Configuration imported successfully", "success");
      } catch (e) {
        console.error("Import failed:", e);
        showSnackbar(
          "Failed to import configuration - invalid file format",
          "error",
        );
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = "";
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all TimeDown data? This action cannot be undone.",
      )
    ) {
      localStorage.removeItem("timedown_events");
      setSettings(DEFAULT_SETTINGS);
      showSnackbar("All data cleared successfully", "success");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3} sx={{ flex: 1 }}>
        {/* Layout Configuration */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Layout Configuration
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Horizontal Alignment</InputLabel>
              <Select
                value={settings.alignment.horizontal}
                onChange={(e) =>
                  handleAlignmentChange("horizontal", e.target.value)
                }
                label="Horizontal Alignment"
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Vertical Alignment</InputLabel>
              <Select
                value={settings.alignment.vertical}
                onChange={(e) =>
                  handleAlignmentChange("vertical", e.target.value)
                }
                label="Vertical Alignment"
              >
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Font Size Configuration
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Countdown Time: {settings.fontSize.countdown}px
              </Typography>
              <Slider
                value={settings.fontSize.countdown}
                onChange={(e, v) => handleFontSizeChange("countdown", v)}
                min={12}
                max={96}
                step={1}
                marks={[
                  { value: 24, label: "24px" },
                  { value: 48, label: "48px" },
                  { value: 72, label: "72px" },
                  { value: 96, label: "96px" },
                ]}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Event Name: {settings.fontSize.eventName}px
              </Typography>
              <Slider
                value={settings.fontSize.eventName}
                onChange={(e, v) => handleFontSizeChange("eventName", v)}
                min={12}
                max={72}
                step={1}
                marks={[
                  { value: 18, label: "18px" },
                  { value: 36, label: "36px" },
                  { value: 54, label: "54px" },
                  { value: 72, label: "72px" },
                ]}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Exact Time: {settings.fontSize.exactTime}px
              </Typography>
              <Slider
                value={settings.fontSize.exactTime}
                onChange={(e, v) => handleFontSizeChange("exactTime", v)}
                min={12}
                max={48}
                step={1}
                marks={[
                  { value: 12, label: "12px" },
                  { value: 24, label: "24px" },
                  { value: 36, label: "36px" },
                  { value: 48, label: "48px" },
                ]}
              />
            </Box>

            <Button variant="outlined" onClick={resetToDefaults} sx={{ mt: 2 }}>
              Reset to Defaults
            </Button>
          </Box>
        </Grid>

        {/* Display Configuration */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Display Configuration
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.display.time}
                  onChange={() => handleDisplayToggle("time")}
                />
              }
              label="Show Countdown Time"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.display.name}
                  onChange={() => handleDisplayToggle("name")}
                />
              }
              label="Show Event Name"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.display.exactTime}
                  onChange={() => handleDisplayToggle("exactTime")}
                />
              }
              label="Show Exact Time"
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Data Management
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button variant="contained" color="primary" onClick={exportData}>
                Export Configuration
              </Button>

              <Button variant="outlined" color="primary" component="label">
                Import Configuration
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: "none" }}
                />
              </Button>

              <Button variant="outlined" color="error" onClick={clearAllData}>
                Clear All Data
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
