import { Bech32Config } from "@keplr-wallet/types";
import { bech32 } from "bech32";

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
    return `${address.slice(0, 8)}..${address.slice(-2, address.length)}`;
};
