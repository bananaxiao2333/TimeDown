// src/components/ErrorBoundary.jsx
import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation } from "react-router-dom";

// 封装一个自定义hook，让类组件能获取location
const withLocation = (WrappedComponent) => {
  return (props) => {
    const location = useLocation();
    return <WrappedComponent {...props} location={location} />;
  };
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidUpdate(prevProps) {
    // 监听路由变化
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.resetError();
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("全局错误捕获:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // 错误页面内容和之前一致，省略...
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            p: 3,
            bgcolor: "background.default",
          }}
        >
          {/* 开发环境显示错误详情，生产环境隐藏 */}
          {process.env.NODE_ENV === "development" && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                mb: 3,
                textAlign: "left",
                maxHeight: "400",
                overflow: "auto",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.primary"
                sx={{ mb: 1 }}
              >
                Error Info
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="monospace"
              >
                {this.state.error?.toString()}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.primary"
                sx={{ mt: 2, mb: 1 }}
              >
                Trace
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="monospace"
              >
                {this.state.errorInfo?.componentStack}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={this.resetError}
            sx={{ px: 4 }}
          >
            重新加载
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// 用自定义的withLocation包装
export default withLocation(ErrorBoundary);
