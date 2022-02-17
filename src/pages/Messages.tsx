import React, { useEffect, useState } from "react";
import { useSecret } from "../hooks/useSecret";
import MessagesTable from "../components/tables/MessagesTable";
import { getMessages, Message, PERMIT_NAME } from "../contracts/scrt/memo";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Else, If, Then } from "react-if";
import SendMsgModal from "../components/modals/SendMsgModal";

const MessagesPage: React.FC = () => {
    const { secretjs, account, permit, deletePermit } = useSecret();
    const [loadingMsgs, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!permit) {
            navigate("/login");
        }
    }, [permit]);

    const getMyMessages = async () => {
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
                        toast.success(`Successfully refreshed messages`);
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
        getMyMessages();
    }, [account, secretjs]);

    return (
        <If condition={!permit}>
            <Then>
                <></>
            </Then>
            <Else>
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>Logged in as: {account}</div>
                        <button
                            onClick={() => {
                                {
                                    deletePermit(PERMIT_NAME);
                                }
                            }}
                        >
                            log out
                        </button>
                    </div>
                    <MessagesTable messages={messages} loading={loadingMsgs} />
                    <SendMsgModal />
                </>
            </Else>
        </If>
    );
};

export default MessagesPage;
