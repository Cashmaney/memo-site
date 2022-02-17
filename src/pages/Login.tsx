import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CreatePermitButton from "../components/scrt/CreatePermitButton";
import CreatePasswordButton from "../components/scrt/CreatePasswordButton";
import { useSecret } from "../hooks/useSecret";
import { Else, If, Then } from "react-if";
import ConnectSecret from "../components/scrt/ConnectSecret";
import { toDisplayAddress } from "../utils/address";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { account, permit } = useSecret();
    const navigate = useNavigate();
    // const { width } = useWindowSize();
    // const isMobile = parseInt(breakingPoints.medium) > width;

    useEffect(() => {
        if (permit) {
            navigate("/");
        }
    }, [account, permit]);

    return (
        <If condition={!!permit}>
            <Then>
                <></>
            </Then>
            <Else>
                <>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "600px",
                            maxHeight: "100vh",
                            overflowY: "auto",
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            sx={{ justifyContent: "center" }}
                        >
                            <Grid item sx={{ width: "80%" }} container>
                                <Typography variant={"h1"}>
                                    Welcome to Memo!
                                </Typography>
                            </Grid>
                            <Grid item sx={{ justifyContent: "center" }}>
                                <Typography variant={"h3"}>
                                    {account
                                        ? `Hello ${toDisplayAddress(account)}`
                                        : "Connect Wallet to Continue"}
                                </Typography>
                            </Grid>
                            <If condition={account}>
                                <Then>
                                    <Grid item xs={6}>
                                        <CreatePermitButton />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <CreatePasswordButton />
                                    </Grid>
                                </Then>
                                <Else>
                                    <Grid item xs={12}>
                                        <ConnectSecret />
                                    </Grid>
                                </Else>
                            </If>
                        </Grid>
                    </Box>
                </>
            </Else>
        </If>
    );
};

export default Login;
