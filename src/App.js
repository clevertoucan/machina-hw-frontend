import "./App.css";
import axiosInstance from "./axios-config";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          display: "block",
          color: "#8fdaff",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          ":before": { height: "0px" },
          backgroundColor: "#1f2937",
          color: "white",
        },
      },
    },
  },
});

function App() {
  const [fileTree, setFileTree] = useState({});

  useEffect(() => {
    axiosInstance.get("/fs/tree").then((value) => setFileTree(value.data));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Sidebar fileTree={fileTree} />
    </ThemeProvider>
  );
}

export default App;
