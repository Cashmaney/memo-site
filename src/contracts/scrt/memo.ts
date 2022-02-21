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
    contract: string,
    to: string,
    message: string,
    codeHash?: string,
    onLoading?: CallableFunction,
    onSuccess?: CallableFunction,
    onFail?: CallableFunction,
) => {
    const msg = new SendMemoMsg(to, message).to_msg();

    sender.tx.compute
        .executeContract({
            codeHash,
            contract,
            msg,
            sender: sender.address,
        })
        .then(() => {
            if (onSuccess) {
                onSuccess();
            }
        })
        .catch((e) => {
            console.log(`error: ${e}`);
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

    console.log(`querying with data: ${JSON.stringify(msg)}`);

    return secretjs.query.compute
        .queryContract({
            address: contract,
            codeHash: codeHash,
            query: msg,
        })
        .catch((e: Error) => {
            console.error(`Error getting data: ${e}`);
            if (onFail) {
                onFail(e);
            } else {
                throw new Error(e.message);
            }
        });
};
