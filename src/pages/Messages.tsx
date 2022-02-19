import React, { useEffect, useState } from "react";
import { useSecret } from "../hooks/useSecret";
import MessagesTable from "../components/tables/MessagesTable";
import { getMessages, Message, PERMIT_NAME } from "../contracts/scrt/memo";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Else, If, Then } from "react-if";
import SendMsgModal from "../components/modals/SendMsgModal";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Typography, useTheme } from "@mui/material";
import { toDisplayAddress } from "../utils/address";
import Box from "@mui/material/Box";
import Navbar from "../components/layout/navBar/Navbar";

const MessagesPage: React.FC = () => {
    const { secretjs, account, permit, chainId } = useSecret();
    const [loadingMsgs, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (!permit) {
            navigate("/login");
        }
    }, [permit]);

    const getMyMessages = async (): Promise<void> => {
        if (account && secretjs) {
            if (permit) {
                setLoading(true);
                getMessages(
                    secretjs,
                    import.meta.env.VITE_MEMO_CONTRACT_ADDRESS,
                    account,
                    { permit },
                    import.meta.env.VITE_MEMO_CONTRACT_CODE_HASH,
                )
                    .then((resp) => {
                        toast.success(`Refreshed messages`, {
                            pauseOnHover: false,
                            autoClose: 2000,
                        });
                        setMessages(resp.msgs);
                    })
                    .catch((e) => {
                        toast.error(e);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        }
    };

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        getMyMessages();
    }, [account]);

    return (
        <If condition={!permit}>
            <Then>
                <></>
            </Then>
            <Else>
                <>
                    <Navbar />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            marginLeft: "9vw",
                        }}
                    >
                        <SendMsgModal />
                    </Box>
                    <MessagesTable messages={messages} loading={loadingMsgs} />
                </>
            </Else>
        </If>
    );
};

export default MessagesPage;
