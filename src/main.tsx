import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#00F",
        },
        background: {
            default: "white",
        },
    },
    typography: {},
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    width: 200,
                },
            },
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            theme={"dark"}
            style={{ zIndex: 999999 }}
        />

        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <App />
            </Router>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root"),
);
