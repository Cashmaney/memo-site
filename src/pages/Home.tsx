import React from "react";
import { Typography } from "@mui/material";
import CreatePermitButton from "../components/scrt/CreatePermitButton";
import CreatePasswordButton from "../components/scrt/CreatePasswordButton";

const Home = () => {
    return (
        <div>
            <Typography variant={"h1"}>Welcome to Memo!</Typography>
            <Typography variant={"h3"}>Login using your wallet</Typography>
            <Typography variant={"body2"}>Create a viewing key</Typography>
            <Typography variant={"body2"}>Or create a password</Typography>
            <CreatePermitButton />
            <CreatePasswordButton />
        </div>
    );
};

export default Home;
