import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import Typography from "@mui/material/Typography";
import { FormControl, InputLabel } from "@mui/material";
import CloseModalIcon from "../icons/CloseModal";
import Button from "@mui/material/Button";
import { isValidBech32 } from "../../utils/address";
import { sendMemo } from "../../contracts/scrt/memo";
import { useSecret } from "../../hooks/useSecret";
import { toast } from "react-toastify";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(1),
    },
    "& .MuiInputBase-input": {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
        border: "1px solid #ced4da",
        fontSize: 16,
        padding: "10px 12px",
        transition: theme.transitions.create([
            "border-color",
            "background-color",
            "box-shadow",
        ]),
        // Use the system font instead of the default Roboto font.
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
        "&:focus": {
            boxShadow: `${alpha(
                theme.palette.primary.main,
                0.25,
            )} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

const SendMsgForm: React.FC<{
    handleClose: CallableFunction;
}> = ({ handleClose }) => {
    const { secretjs, account } = useSecret();
    const [toAddress, setToAddress] = useState<string>("");
    const [msg, setMsg] = useState<string>("");

    const [validAddress, setValidAddress] = useState<boolean>(true);
    const [validMsg, setValidMsg] = useState<boolean>(true);

    useEffect(() => {
        console.log(`testing`);
        setValidAddress(isValidBech32(toAddress));
    }, [toAddress]);

    useEffect(() => {
        console.log(`hello: ${msg.length < 280}`);
        setValidMsg(msg.length < 280);
    }, [msg]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (secretjs && account) {
            await sendMemo(
                secretjs,
                account,
                import.meta.env.VITE_MEMO_CONTRACT_ADDRESS,
                toAddress,
                msg,
                import.meta.env.VITE_MEMO_CONTRACT_CODE_HASH,
                () => {
                    toast.success("Memo sent successfully");
                },
                (error: any) => {
                    toast.error(
                        `Failed to send memo: ${JSON.stringify(error)}`,
                    );
                },
            );
            handleClose();
        }
    };

    return (
        <div
            style={{
                // minHeight: "calc(1vh - 1rem)",
                minHeight: "calc(1vh - 1rem)",
                maxWidth: isMobile ? "400px" : "600px",
                width: isMobile ? "calc(100vw - 2rem)" : "500px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    placeContent: "space-between",
                    placeItems: "center",
                }}
            >
                <CloseModalIcon
                    onClick={() => {
                        handleClose();
                    }}
                />
            </div>

            <div style={{ color: "white", padding: "1em" }}>
                <Typography variant={"h3"}>
                    <span
                        style={{
                            color: "#00d8ff",
                            marginRight: "0.5rem",
                        }}
                    >
                        Send
                    </span>{" "}
                    Memo
                </Typography>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        placeContent: "center",
                        placeItems: "center",
                        gap: "0.5em",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                            placeContent: "center",
                            placeItems: "center",
                            textAlign: "center",
                            padding: "1em 0",
                            marginBottom: "1.5em",
                            fontFamily: "roboto",
                            fontSize: isMobile ? 10 : 22,
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <form
                                onSubmit={(event) => {
                                    handleSubmit(event);
                                }}
                            >
                                <FormControl
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        maxWidth: "80%",
                                        marginBottom: "1rem",
                                    }}
                                    error={!validAddress}
                                >
                                    <InputLabel htmlFor="send-to-address">
                                        To
                                    </InputLabel>
                                    <BootstrapInput
                                        id="send-to-address"
                                        aria-describedby="send-to-address-text"
                                        value={toAddress}
                                        onChange={(value) => {
                                            setToAddress(value.target.value);
                                        }}
                                    />
                                    {/*<FormHelperText id="send-to-address-text">*/}
                                    {/*    Secret Address (Cosmos/Osmo/etc?)*/}
                                    {/*</FormHelperText>*/}
                                </FormControl>
                                <FormControl
                                    sx={{
                                        width: 500,
                                        maxWidth: "100%",
                                    }}
                                    error={!validMsg}
                                >
                                    <InputLabel shrink htmlFor="message-input">
                                        Message
                                    </InputLabel>
                                    <BootstrapInput
                                        fullWidth
                                        multiline
                                        id="message-input"
                                        value={msg}
                                        onChange={(value) => {
                                            setMsg(value.target.value);
                                        }}
                                    />
                                </FormControl>
                                <Button
                                    sx={{ m: 4 }}
                                    variant={"contained"}
                                    color={"primary"}
                                    type="submit"
                                    disabled={!validMsg || !validAddress}
                                >
                                    Send
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMsgForm;
