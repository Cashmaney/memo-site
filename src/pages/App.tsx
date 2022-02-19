import Login from "./Login";
import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "../components/layout/navBar/Navbar";
import Footer from "../components/layout/footer/Footer";

import ContextProvider from "../hooks/ContextProvider";
import Messages from "./Messages";
import { PERMIT_NAME } from "../contracts/scrt/memo";
import "./App.css";

function App() {
    return (
        <>
            <ContextProvider>
                {/*<Navbar />*/}

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Messages />} />
                </Routes>
                {/*<Footer />*/}
            </ContextProvider>
        </>
    );
}

export default App;
