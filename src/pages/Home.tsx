import React from "react";
import { Typography } from "@mui/material";
import CreatePermitButton from "../components/scrt/CreatePermitButton";
import CreatePasswordButton from "../components/scrt/CreatePasswordButton";

window.addEventListener(
    "keplr_keystorechange",
    () => {
        console.log("Key store in Keplr is changed. Refreshing page.");
        location.reload();
    },
    false,
);

const Home = () => {
    return (
        <div>
            <Typography variant={"h1"}>Welcome to Whisper!</Typography>
            <Typography variant={"h3"}>Login using your wallet</Typography>
            <Typography variant={"body2"}>Sign a permit</Typography>
            <Typography variant={"body2"}>Or create a password</Typography>
            <CreatePermitButton />
            <CreatePasswordButton />
        </div>
    );
};

export default Home;
