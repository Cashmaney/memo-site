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
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Navbar from "../components/layout/navBar/Navbar";
import RefreshIcon from "@mui/icons-material/Refresh";
import { sleep } from "../utils/functions";

const MessagesPage: React.FC = () => {
    const { secretjs, account, permit, chainId, getLocalPermit } = useSecret();
    const [loadingMsgs, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stuff = async () => {
            await sleep(200);
            if (!permit) {
                navigate("/login");
            }
        };
        stuff();
    }, [permit]);

    const getMyMessages = async (): Promise<void> => {
        console.log(`triggered this: ${account} ${secretjs}`);
        let matchedPermit = permit;
        if (account && secretjs) {
            console.log(`getting messages for: ${account} ${chainId}`);
            if (permit) {
                if (!matchUserWithPermit(permit, account)) {
                    matchedPermit = getLocalPermit(PERMIT_NAME, false);

                    if (!matchUserWithPermit(matchedPermit!, account)) {
                        toast.info(
                            `Permit does not match this account. Please sign new permit`,
                        );
                        setLoading(true);
                        matchedPermit = await getPermitFromUser(
                            account,
                            chainId,
                            PERMIT_NAME,
                            [import.meta.env.VITE_MEMO_CONTRACT_ADDRESS],
                            PERMIT_PERMISSION,
                        ).catch((reason) => {
                            console.error(`Failed to sign permit: ${reason}`);
                            toast.error(`Failed to sign permit`);
                            setMessages([]);
                            setLoading(false);
                            return undefined;
                        });
                        if (!matchedPermit) {
                            return;
                        }
                    }
                }
                setLoading(true);
                getMessages(
                    secretjs,
                    import.meta.env.VITE_MEMO_CONTRACT_ADDRESS,
                    account,
                    { permit: matchedPermit },
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
                            justifyContent: "space-between",
                            marginLeft: "9vw",
                            marginRight: "9vw",
                        }}
                    >
                        <SendMsgModal />
                        <IconButton
                            onClick={() => {
                                getMyMessages();
                            }}
                            sx={{ p: 2, m: 2 }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                    <MessagesTable messages={messages} loading={loadingMsgs} />
                </>
            </Else>
        </If>
    );
};

export default MessagesPage;
