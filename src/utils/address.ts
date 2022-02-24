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
        return true;
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

export const toDisplayBalance = (amount: string): string => {
    // if (isNaN(amount)) {
    //     return "0";
    // }
    const x = Number(amount) / 1e6;
    return nFormatter(x, 2);
    // return Number(amount) / 1e6;

    // return new Intl.NumberFormat("en-US", {
    //     minimumFractionDigits: 0,
    //     maximumFractionDigits: 2,
    // }).format();
};

export const nFormatter = (num: number, digits: number) => {
    const si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

export const toFixedTrunc = (x: number | string, n: number): string => {
    const v = (typeof x === "string" ? x : x.toString()).split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substring(0, n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
};
