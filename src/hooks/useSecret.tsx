import React, { createContext, useContext, useEffect, useState } from "react";
import { getFromLS, setToLS } from "../utils/storage";
import { SecretNetworkClient } from "secretjs";
import { sleep } from "../utils/functions";
import { newPermit as signPermit, Permission, Permit } from "./scrt/permit";
import { Keplr } from "@keplr-wallet/types";
// import { TokenID } from "../utils/nft";
import { setupKeplr } from "./scrt/utils";
import { OfflineSigner } from "@cosmjs/launchpad";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SecretUtils } from "secretjs/types/enigmautils";
import { PERMIT_NAME } from "../contracts/scrt/memo";

declare global {
    interface Window {
        keplr: Keplr;
        getOfflineSigner?: (
            chainId: string,
        ) => OfflineSigner & OfflineDirectSigner;
        getOfflineSignerOnlyAmino?: (chainId: string) => OfflineSigner;
        getOfflineSignerAuto?: (
            chainId: string,
        ) => Promise<OfflineSigner | OfflineDirectSigner>;
        getEnigmaUtils?: (chainId: string) => SecretUtils;
    }
}
//
// const BALANCE_REFRESH_TIME = 15_000;

const getScrtBalance = async (
    secretjs: SecretNetworkClient | undefined,
    account: string,
): Promise<string | undefined> => {
    if (secretjs) {
        const accounts = await secretjs.query.bank.balance({
            address: account,
            denom: "uscrt",
        });

        const balance = accounts.balance?.amount;
        if (!isNaN(Number(balance))) {
            return balance;
        }
    }
};

export const SecretChainContext = createContext<{
    secretjs?: SecretNetworkClient;
    secretLoaded: boolean;
    refreshBalances: CallableFunction;
    account?: string | undefined;
    scrtBalance?: string | undefined;
    setupSecretJS: CallableFunction;
    getLocalPermit: CallableFunction;
    permit?: Permit;
    newPermit: CallableFunction;
    deletePermit: CallableFunction;
}>({
    secretLoaded: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refreshBalances() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setupSecretJS: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getLocalPermit() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    newPermit() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deletePermit() {},
});

const getStoragePermitName = (account: string, permitName: string) => {
    return `query_permit_${account}_${permitName}`;
};

export const getPermitFromUser = async (
    account: string,
    permitName: string,
    tokens: string[],
    permissions: Permission[],
): Promise<Permit | undefined> => {
    const storagePermitName = getStoragePermitName(account, permitName);

    const rawPermit = getFromLS(storagePermitName);
    if (!rawPermit) {
        const permit = await signPermit(
            window.keplr as Keplr,
            account,
            import.meta.env.VITE_SECRET_CHAIN_ID,
            permitName,
            tokens,
            permissions,
        );
        setPermit(storagePermitName, permit);
        return permit;
    } else {
        return JSON.parse(rawPermit);
    }
};

export const setPermit = (permitName: string, permit: Permit) => {
    return setToLS(permitName, JSON.stringify(permit));
};

export const SecretContext: React.FC<React.ReactNode> = (props) => {
    const [secretjs, setSecretJS] = useState<SecretNetworkClient | undefined>(
        undefined,
    );
    const [account, setLocalAccount] = useState<string>("");
    const [secretLoaded, setSecretLoaded] = useState<boolean>(false);
    const [accountPermit, setPermit] = useState<Permit | undefined>(undefined);
    const [scrtBalance, setScrtBalance] = useState<string | undefined>(
        undefined,
    );
    //const [permitManager] = useState<PermitManager>(new PermitManager());

    // const savePermit = (permitName: string, permit: Permit) => {
    //     return permitManager.set(permitName, permit);
    // };
    //
    // const loadPermit = (permitName: string): Permit | undefined => {
    //     return permitManager.get(permitName);
    // };

    const newPermit = async (
        permitName: string,
        tokens: string[],
        permissions: Permission[],
    ): Promise<Permit | undefined> => {
        if (account) {
            if (getLocalPermit(permitName)) {
                return accountPermit;
            }
            const permit = await signPermit(
                window.keplr as Keplr,
                account,
                import.meta.env.VITE_SECRET_CHAIN_ID,
                permitName,
                tokens,
                permissions,
            );

            if (permit) {
                setPermit(permit);
            }

            return permit;
        }
    };

    const getLocalPermit = (permitName: string): Permit | undefined => {
        console.log(`getting permit for ${account} name: ${permitName}`);
        const storagePermitName = getStoragePermitName(account, permitName);
        const rawPermit = getFromLS(storagePermitName);

        if (rawPermit) {
            const parsed = JSON.parse(rawPermit);
            if (parsed !== accountPermit) {
                setPermit(parsed);
            }
            return parsed;
        }
    };

    const deletePermit = (permitName: string) => {
        const storagePermitName = getStoragePermitName(account, permitName);

        setToLS(storagePermitName, "");
        setPermit(undefined);
    };

    const setAccount = (account: string) => {
        setToLS("account", account);
        setLocalAccount(account);
    };

    const getAccount = (): string | undefined => {
        return getFromLS("account");
    };

    const refreshBalances = async () => {
        if (!account || !secretjs) {
            return;
        }

        await Promise.all([
            getScrtBalance(secretjs, account)
                .then((result) => {
                    if (result) {
                        setScrtBalance(result);
                    }
                })
                .catch((err) => {
                    console.log(`Error getting token balances: ${err}`);
                }),
        ]);
    };

    useEffect(() => {
        // first load, instantly refresh balances
        getScrtBalance(secretjs, account).then((balance) => {
            if (balance) {
                setScrtBalance(balance);
            }
        });
        getLocalPermit(PERMIT_NAME);
    }, [secretjs, account]);

    const setupSecretJS = async () => {
        // Wait for Keplr to be injected to the page
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        while (
            !window.keplr ||
            !window.getEnigmaUtils ||
            !window.getOfflineSignerOnlyAmino
        ) {
            await sleep(50);
        }

        if (import.meta.env.VITE_SECRET_CHAIN_ID !== "secret-4") {
            await setupKeplr();
        }

        await window.keplr.enable(import.meta.env.VITE_SECRET_CHAIN_ID);

        // Setup SecretJS with Keplr’s OfflineSigner
        // This pops-up a window for the user to sign on each tx we sent
        const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(
            import.meta.env.VITE_SECRET_CHAIN_ID,
        );
        const accounts = await keplrOfflineSigner.getAccounts();

        const secretjs = await SecretNetworkClient.create(
            import.meta.env.VITE_SECRET_RPC,
        );

        setAccount(accounts[0].address);
        setSecretJS(secretjs);
        setSecretLoaded(true);
    };

    return (
        <SecretChainContext.Provider
            value={{
                secretjs,
                scrtBalance,
                refreshBalances,
                secretLoaded,
                account,
                setupSecretJS,
                getLocalPermit,
                permit: accountPermit,
                deletePermit,
                newPermit,
            }}
        >
            {props.children}
        </SecretChainContext.Provider>
    );
    // return {
    //     secretjs,
    //     secretLoaded,
    //     getSnip20Balance,
    //     account,
    //     exchangeRate,
    // };
};

export const useSecret = () => useContext(SecretChainContext);
