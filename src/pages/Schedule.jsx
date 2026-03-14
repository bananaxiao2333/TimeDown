import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import { MuiColorInput } from "mui-color-input";
import cronstrue from "cronstrue";
// Fix cron-parser import - use default export for v4.9.0
import cronParser from "cron-parser";
// Add use-local-storage-state hook
import useLocalStorageState from "use-local-storage-state";

const Schedule = () => {
  const theme = useTheme();
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cron: "",
    bgColor: "#2196f3",
    textColor: "#ffffff",
  });
  const [cronHumanReadable, setCronHumanReadable] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Use use-local-storage-state hook for events
  const [events, setEvents] = useLocalStorageState("timedown_events", {
    defaultValue: [],
  });

  // Update human-readable cron when cron changes
  useEffect(() => {
    if (formData.cron.trim()) {
      try {
        const human = cronstrue.toString(formData.cron);
        setCronHumanReadable(human);

        // Clear cron error if valid
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.cron;
          return newErrors;
        });
      } catch (e) {
        setCronHumanReadable("Invalid cron expression");
        // Set cron error
        setFormErrors((prev) => ({
          ...prev,
          cron: "Invalid cron expression format",
        }));
      }
    } else {
      setCronHumanReadable("");
      // Set cron error when empty (required field)
      setFormErrors((prev) => ({
        ...prev,
        cron: "Cron expression is required",
      }));
    }
  }, [formData.cron]);

  // Validate individual field and update errors
  const validateField = (field, value) => {
    const errors = { ...formErrors };

    switch (field) {
      case "name":
        if (!value.trim()) {
          errors.name = "Event name is required";
        } else if (value.trim().length > 100) {
          errors.name = "Event name must be less than 100 characters";
        } else {
          delete errors.name;
        }
        break;

      case "cron":
        if (!value.trim()) {
          errors.cron = "Cron expression is required";
        } else {
          try {
            // Use parseExpression for v4.9.0
            cronParser.parseExpression(value.trim());
            delete errors.cron;
          } catch (e) {
            errors.cron = "Invalid cron expression format";
          }
        }
        break;

      case "bgColor":
      case "textColor":
        const isValidHexColor = (color) => /^#[0-9A-Fa-f]{6}$/.test(color);
        if (!isValidHexColor(value)) {
          errors[field] = `Invalid ${field} format (use #RRGGBB)`;
        } else {
          delete errors[field];
        }
        break;

      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = () => {
    // Validate all fields before submitting
    validateField("name", formData.name);
    validateField("cron", formData.cron);
    validateField("bgColor", formData.bgColor);
    validateField("textColor", formData.textColor);

    // Check if there are any errors
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const newEvent = {
      id: editingEvent?.id || Date.now().toString(),
      name: formData.name.trim(),
      cron: formData.cron.trim(),
      bgColor: formData.bgColor,
      textColor: formData.textColor,
    };

    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map((e) =>
        e.id === editingEvent.id ? newEvent : e,
      );
      setEvents(updatedEvents);
    } else {
      // Add new event
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
    }

    // Reset form
    setEditingEvent(null);
    setFormData({
      name: "",
      cron: "",
      bgColor: "#2196f3",
      textColor: "#ffffff",
    });
    setFormErrors({});
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      cron: event.cron || "",
      bgColor: event.bgColor,
      textColor: event.textColor,
    });
    // Clear errors when editing
    setFormErrors({});
  };

  const handleDelete = (eventId) => {
    const updatedEvents = events.filter((e) => e.id !== eventId);
    setEvents(updatedEvents);

    if (editingEvent?.id === eventId) {
      setEditingEvent(null);
      setFormData({
        name: "",
        cron: "",
        bgColor: "#2196f3",
        textColor: "#ffffff",
      });
      setFormErrors({});
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      cron: "",
      bgColor: "#2196f3",
      textColor: "#ffffff",
    });
    setFormErrors({});
  };

  const commonCronTemplates = [
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every weekday at 9 AM", value: "0 9 * * 1-5" },
    { label: "Every Monday at 8 AM", value: "0 8 * * 1" },
    { label: "First day of every month at noon", value: "0 12 1 * *" },
    { label: "Every hour", value: "0 * * * *" },
  ];

  // Check if form has any errors
  const hasErrors = Object.keys(formErrors).length > 0;

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>

      <Grid container spacing={3} sx={{ flex: 1 }}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {editingEvent ? "Edit Event" : "Add New Event"}
            </Typography>

            <TextField
              fullWidth
              label="Event Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              margin="normal"
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              fullWidth
              label="Cron Expression"
              value={formData.cron}
              onChange={(e) => handleInputChange("cron", e.target.value)}
              placeholder="e.g., 0 9 * * 1-5"
              helperText={
                cronHumanReadable ||
                formErrors.cron ||
                "Cron expression is required for scheduling"
              }
              margin="normal"
              error={!!formErrors.cron}
            />

            {/* Cron Templates */}
            <Typography variant="body2" gutterBottom sx={{ mt: 1 }}>
              Common templates:
            </Typography>
            {commonCronTemplates.map((template) => (
              <Button
                key={template.value}
                size="small"
                onClick={() => handleInputChange("cron", template.value)}
                sx={{ mr: 1, mb: 1 }}
                variant={
                  formData.cron === template.value ? "contained" : "outlined"
                }
              >
                {template.label}
              </Button>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Color Configuration
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Background Color
                </Typography>
                <MuiColorInput
                  format="hex"
                  value={formData.bgColor}
                  onChange={(value) => handleInputChange("bgColor", value)}
                  sx={{ width: "100%" }}
                  error={!!formErrors.bgColor}
                  helperText={formErrors.bgColor}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Text Color
                </Typography>
                <MuiColorInput
                  format="hex"
                  value={formData.textColor}
                  onChange={(value) => handleInputChange("textColor", value)}
                  sx={{ width: "100%" }}
                  error={!!formErrors.textColor}
                  helperText={formErrors.textColor}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={hasErrors}
              >
                {editingEvent ? "Update" : "Add"} Event
              </Button>
              {(editingEvent ||
                formData.name.trim() ||
                formData.cron.trim()) && (
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Events List - Full Width */}
        <Grid item xs={12}>
          <Box sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Scheduled Events ({events.length})
            </Typography>

            {events.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No events scheduled yet
              </Typography>
            ) : (
              <List sx={{ width: "100%" }}>
                {events.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      bgcolor: event.bgColor,
                      color: event.textColor,
                      mb: 1,
                      borderRadius: 1,
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      primary={event.name}
                      secondary={
                        <>
                          {event.cron && (
                            <span>
                              <strong>Cron:</strong> {event.cron} -{" "}
                              {cronstrue.toString(event.cron)}
                            </span>
                          )}
                        </>
                      }
                    />
                    <Box>
                      <Button
                        size="small"
                        onClick={() => handleEdit(event)}
                        sx={{ mr: 1, color: event.textColor }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleDelete(event.id)}
                        color="error"
                        sx={{ color: event.textColor }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Schedule;
