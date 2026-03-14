import { Box, Typography, Container, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const About = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          px: 2,
          textAlign: "center",
          bgcolor: theme.palette.background.paper,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TimeDown
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            A lightweight, high-performance countdown timer application built
            with modern web technologies
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Schedule events with cron expressions and display real-time
            countdowns with Picture-in-Picture support
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              href="/#/display"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: "medium",
              }}
            >
              View Display
            </Button>
            <Button
              variant="outlined"
              color="primary"
              href="/#/schedule"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: "medium",
              }}
            >
              Schedule Events
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              href="https://github.com/bananaxiao2333/TimeDown/"
              target="_blank"
              rel="noopener"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: "medium",
              }}
            >
              GitHub
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            bgcolor: theme.palette.background.paper,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Technology Stack
          </Typography>
          <Typography variant="body1" paragraph>
            • React 19.2.0
            <br />
            • Vite 8.0.0-beta.13
            <br />
            • Material-UI (MUI) v7
            <br />
            • React Router DOM 7.13.1
            <br />• cron-parser for event scheduling
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" paragraph>
            Use the Schedule page to create and manage your events, then view
            active countdowns on the Display page. Customize your viewing
            experience through the Settings page.
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          px: 2,
          textAlign: "center",
          mt: "auto",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Built with love
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} TimeDown
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default About;