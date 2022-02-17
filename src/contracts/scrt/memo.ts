import { Permission, Permit } from "../../hooks/scrt/permit";
import { MsgExecuteContract, SecretNetworkClient } from "secretjs";

export class SendMemoMsg {
    send_memo: {
        to: string;
        message: string;
    };

    constructor(to: string, message: string) {
        this.send_memo = {
            to,
            message,
        };
    }

    to_msg() {
        return {
            send_memo: this.send_memo,
        };
    }
}

export class ReadMessages {
    get_memo: {
        auth: {
            permit?: Permit;
            key?: string;
        };
        address: string;
        page?: number;
        page_size?: number;
    };

    constructor(
        address: string,
        auth: { permit?: Permit; key?: string },
        page?: number,
        page_size?: number,
    ) {
        this.get_memo = {
            auth,
            address,
            page,
            page_size,
        };
    }

    to_msg() {
        return {
            get_memo: this.get_memo,
        };
    }
}

export interface Message {
    from: string;
    message: string;
    block_time: number;
}

export interface ReadMessagesResponse {
    msgs: Message[];
}

export const PERMIT_NAME = `memo_${import.meta.env.VITE_MEMO_CONTRACT_ADDRESS}`;
export const PERMIT_PERMISSION: Permission[] = ["history"];

export const sendMemo = async (
    sender: SecretNetworkClient,
    senderAddress: string,
    contract: string,
    to: string,
    message: string,
    codeHash?: string,
    onSuccess?: CallableFunction,
    onFail?: CallableFunction,
) => {
    const msg = new SendMemoMsg(to, message).to_msg();

    const txMsg = new MsgExecuteContract({
        sender: senderAddress,
        contract,
        msg,
        codeHash,
    });

    sender.tx
        .broadcast([txMsg], {
            gasLimit: 150_000,
            gasPriceInFeeDenom: 0.25,
            feeDenom: "uscrt",
        })
        .then(() => {
            if (onSuccess) {
                onSuccess();
            }
        })
        .catch((e) => {
            if (onFail) {
                onFail(e);
            }
        });
};

export const getMessages = async (
    secretjs: SecretNetworkClient,
    contract: string,
    address: string,
    auth: { permit?: Permit; key?: string },
    codeHash?: string,
    page?: number,
    page_size?: number,
    onFail?: CallableFunction,
): Promise<ReadMessagesResponse> => {
    const msg = new ReadMessages(address, auth, page, page_size).to_msg();

    return secretjs.query.compute.queryContract({
        address: contract,
        codeHash: codeHash,
        query: msg,
    });
};
