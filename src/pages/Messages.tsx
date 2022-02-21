import React, { useEffect, useState } from "react";
import {
    getPermitFromUser,
    matchUserWithPermit,
    useSecret,
} from "../hooks/useSecret";
import MessagesTable from "../components/tables/MessagesTable";
import {
    getMessages,
    Message,
    PERMIT_NAME,
    PERMIT_PERMISSION,
} from "../contracts/scrt/memo";
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
            console.log(`getting messages for: ${account} ${chainId}`);
            if (permit) {
                if (!matchUserWithPermit(permit, account)) {
                    toast.info(
                        `Permit does not match this account. Please sign new permit`,
                    );
                    getPermitFromUser(
                        account,
                        PERMIT_NAME,
                        [import.meta.env.VITE_MEMO_CONTRACT_ADDRESS],
                        PERMIT_PERMISSION,
                    ).catch((reason) => {
                        console.error(`Failed to sign permit: ${reason}`);
                        toast.error(`Failed to sign permit`);
                    });
                    setMessages([]);
                    return;
                }

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
                        console.log(`got msgs: ${JSON.stringify(resp)}`);
                        setMessages(resp.msgs);
                    })
                    .catch((e: Error) => {
                        toast.error(`Error loading messages: ${e.message}`);
                        setMessages([]);
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
    }, [account, permit]);

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
