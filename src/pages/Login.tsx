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
import Paper from "@mui/material/Paper";

const Login = () => {
    const { account, permit, chainId } = useSecret();
    const navigate = useNavigate();
    // const { width } = useWindowSize();
    // const isMobile = parseInt(breakingPoints.medium) > width;

    useEffect(() => {
        console.log(`loaded event listening`);
    }, []);

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
                    <Paper
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "600px",
                            maxHeight: "100vh",
                            minHeight: "400px",
                            overflowY: "auto",
                            border: 4,
                            borderRadius: 15,
                            borderColor: "#7289da",
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                justifyContent: "center",
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    width: "80%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant={"h1"}>Whisprs</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant={"h5"}>
                                    Decentralized Private Messaging
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant={"h6"}>
                                    {account
                                        ? `${toDisplayAddress(account)}`
                                        : null}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                rowGap={10}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <If condition={account}>
                                    <Then>
                                        <Grid
                                            container
                                            sx={{
                                                display: "flex",
                                                marginTop: "40px",
                                            }}
                                        >
                                            <Grid
                                                item
                                                xs={6}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <CreatePermitButton />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={6}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <CreatePasswordButton />
                                            </Grid>
                                        </Grid>
                                    </Then>
                                    <Else>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <ConnectSecret chainId={chainId} />
                                        </Grid>
                                    </Else>
                                </If>
                                <Grid item>
                                    <Typography variant={"caption"}>
                                        Powered by Secret Network
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </>
            </Else>
        </If>
    );
};

export default Login;
