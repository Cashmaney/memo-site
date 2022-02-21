import { Bech32Config } from "@keplr-wallet/types";
import { bech32 } from "bech32";

export const bech32FromPubkey = (pubkey: string, hrp: string): string => {
    const decodedB64 = atob(pubkey);
    const rawLength = decodedB64.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
        array[i] = decodedB64.charCodeAt(i);
    }

    return bech32.encode(hrp, bech32.toWords(array), 32);
};

export const convertBech32 = (address: string, toHrp: string): string => {
    const { words } = bech32.decode(address);
    return bech32.encode(toHrp, words);
};

export const isValidSecretAddress = (address: string): boolean => {
    try {
        const { prefix } = bech32.decode(address);
        return prefix === "secret" && address.length === 45;
    } catch (e) {
        return false;
    }
};

export const isValidBech32 = (address: string): boolean => {
    try {
        const { prefix } = bech32.decode(address);
        return address.length === 45;
    } catch (e) {
        return false;
    }
};

export function defaultBech32Config(
    mainPrefix: string,
    validatorPrefix = "val",
    consensusPrefix = "cons",
    publicPrefix = "pub",
    operatorPrefix = "oper",
): Bech32Config {
    return {
        bech32PrefixAccAddr: mainPrefix,
        bech32PrefixAccPub: mainPrefix + publicPrefix,
        bech32PrefixValAddr: mainPrefix + validatorPrefix + operatorPrefix,
        bech32PrefixValPub:
            mainPrefix + validatorPrefix + operatorPrefix + publicPrefix,
        bech32PrefixConsAddr: mainPrefix + validatorPrefix + consensusPrefix,
        bech32PrefixConsPub:
            mainPrefix + validatorPrefix + consensusPrefix + publicPrefix,
    };
}

/** Shorten account string to 23 chars */
export const shortenAccount = (account: string): string => {
    const peek = 10;
    const a = account.slice(0, peek);
    const b = account.slice(account.length - peek, account.length);
    return `${a}...${b}`;
};

export const toDisplayAddress = (address: string | undefined) => {
    if (!address) {
        return;
    }
    return `${address.slice(0, 9)}..${address.slice(-3, address.length)}`;
};
