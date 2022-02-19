import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { grey } from "./utils/colors";

//	#7289da	rgb(114, 137, 218)
// #ffffff	rgb(255, 255, 255)
// #99aab5	rgb(153, 170, 181)
// #2c2f33	rgb(44, 47, 51)
// #23272a	rgb(35, 39, 42)

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#3E5060",
        },
        background: {
            default: "#23272a",
            paper: "#1A2027",
        },
        secondary: {
            main: "#99aab5",
        },
    },
    typography: {
        h1: {
            color: "#ffffff",
            fontFamily: "Inter",
        },
        h3: {
            color: "#ffffff",
            fontFamily: "Inter",
        },
        body1: {
            fontFamily: "Inter",
        },
        button: {
            fontFamily: "Inter",
        },
        caption: {
            color: grey[600],
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    width: 200,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontFamily: [
                        "Inter",
                        "-apple-system",
                        "BlinkMacSystemFont",
                        '"Segoe UI"',
                        "Roboto",
                        '"Helvetica Neue"',
                        "Arial",
                        "sans-serif",
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"',
                    ].join(","),
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: "#2c2f33",
                    fontFamily: [
                        "-apple-system",
                        "BlinkMacSystemFont",
                        '"Segoe UI"',
                        "Roboto",
                        '"Helvetica Neue"',
                        "Arial",
                        "sans-serif",
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"',
                    ].join(","),
                    border: "1px solid #ced4da",
                    fontSize: 16,
                    borderRadius: 4,
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
