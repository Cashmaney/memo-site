import { StdSignDoc } from "secretjs/dist/wallet_amino";
import { Keplr } from "@keplr-wallet/types";

export type Permission = "owner" | "history" | "balance" | "Allowance";

export interface StdSignature {
    readonly pub_key: PubKey;
    readonly signature: string;
}

export interface PubKey {
    readonly type: string;
    readonly value: string;
}

export interface Permit {
    params: {
        permit_name: string;
        allowed_tokens: string[];
        chain_id: string;
        permissions: string[];
    };
    signature: StdSignature;
}

export const newSignDoc = (
    chainId: string,
    permit_name: string,
    allowed_tokens: string[],
    permissions: string[],
): StdSignDoc => {
    return {
        chain_id: chainId,
        account_number: "0", // Must be 0
        sequence: "0", // Must be 0
        fee: {
            amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
            gas: "1", // Must be 1
        },
        msgs: [
            {
                type: "query_permit", // Must be "query_permit"
                value: {
                    permit_name,
                    allowed_tokens,
                    permissions,
                },
            },
        ],
        memo: "", // Must be empty
    };
};

export const newPermit = async (
    signer: Keplr,
    owner: string,
    chainId: string,
    permitName: string,
    allowedTokens: string[],
    permissions: Permission[],
): Promise<Permit> => {
    const { signature } = await signer.signAmino(
        chainId,
        owner,
        {
            chain_id: chainId,
            account_number: "0", // Must be 0
            sequence: "0", // Must be 0
            fee: {
                amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
                gas: "1", // Must be 1
            },
            msgs: [
                {
                    type: "query_permit", // Must be "query_permit"
                    value: {
                        permit_name: permitName,
                        allowed_tokens: allowedTokens,
                        permissions,
                    },
                },
            ],
            memo: "", // Must be empty
        },
        {
            preferNoSetFee: true, // Fee must be 0, so hide it from the user
            preferNoSetMemo: true, // Memo must be empty, so hide it from the user
        },
    );

    return {
        params: {
            chain_id: chainId,
            permit_name: permitName,
            allowed_tokens: allowedTokens,
            permissions,
        },
        signature: signature,
    };
};
//
// const pubKeyToAddress() => {
//
// }
