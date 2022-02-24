import React, { createContext, useContext, useEffect, useState } from "react";
import { getFromLS, setToLS } from "../utils/storage";
import {
    base64PubkeyToAddress,
    EncryptionUtils,
    SecretNetworkClient,
} from "secretjs";
import { sleep } from "../utils/functions";
import { newPermit as signPermit, Permission, Permit } from "./scrt/permit";
import { Keplr } from "@keplr-wallet/types";
// import { TokenID } from "../utils/nft";
import { setupKeplrCustomChain } from "./scrt/utils";
import { OfflineSigner } from "@cosmjs/launchpad";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { PERMIT_NAME } from "../contracts/scrt/memo";
import { convertBech32 } from "../utils/address";

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
        getEnigmaUtils?: (chainId: string) => EncryptionUtils;
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
    chainId: string;
    setChainId: CallableFunction;
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
    chainId: import.meta.env.VITE_SECRET_CHAIN_ID,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setChainId() {},
});

const getStoragePermitName = (account: string, permitName: string) => {
    return `query_permit_${account}_${permitName}`;
};

export const getPermitFromUser = async (
    account: string,
    chainId: string,
    permitName: string,
    tokens: string[],
    permissions: Permission[],
): Promise<Permit | undefined> => {
    const asScrtAccount = convertBech32(account, "secret");
    const storagePermitName = getStoragePermitName(asScrtAccount, permitName);

    const rawPermit = getFromLS(storagePermitName);
    if (!rawPermit) {
        const permit = await signPermit(
            window.keplr as Keplr,
            account,
            chainId,
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

export const matchUserWithPermit = (
    permit: Permit,
    account: string,
): boolean => {
    const secretAcc = convertBech32(account, "secret");
    const permitAcc = base64PubkeyToAddress(
        permit.signature.pub_key.value,
        "secret",
    );

    return permitAcc === secretAcc;
    // permit.signature.pub_key.value
};

export const SecretContext: React.FC<React.ReactNode> = (props) => {
    const [secretjs, setSecretJS] = useState<SecretNetworkClient | undefined>(
        undefined,
    );
    const [chainId, setChainId] = useState<string>(
        import.meta.env.VITE_SECRET_CHAIN_ID,
    );
    const [account, setLocalAccount] = useState<string>("");
    const [secretLoaded, setSecretLoaded] = useState<boolean>(false);
    const [accountPermit, setPermit] = useState<Permit | undefined>(undefined);
    const [scrtBalance, setScrtBalance] = useState<string | undefined>(
        undefined,
    );

    useEffect(() => {
        const stuff = async () => {
            if (!secretjs) {
                await setupSecretJS(chainId);
            } else {
                if (window.getOfflineSignerOnlyAmino) {
                    const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(
                        chainId || import.meta.env.VITE_SECRET_CHAIN_ID,
                    );
                    const accounts = await keplrOfflineSigner.getAccounts();
                    console.log(`setting account: ${accounts[0].address}`);
                    setAccount(accounts[0].address);
                }
            }
        };
        stuff();
    }, [chainId]);

    useEffect(() => {
        if (account) {
            getLocalPermit(PERMIT_NAME);
        }
    }, [account]);

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
                chainId,
                permitName,
                tokens,
                permissions,
            );

            if (permit) {
                const asScrtAccount = convertBech32(account, "secret");
                const storagePermitName = getStoragePermitName(
                    asScrtAccount,
                    permitName,
                );

                setToLS(storagePermitName, JSON.stringify(permit));
                setPermit(permit);
            }

            return permit;
        }
    };

    const getLocalPermit = (permitName: string): Permit | undefined => {
        console.log(`getting permit for ${account} name: ${permitName}`);

        const asScrtAccount = convertBech32(account, "secret");

        const storagePermitName = getStoragePermitName(
            asScrtAccount,
            permitName,
        );
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
        if (secretjs && account) {
            if (chainId === import.meta.env.VITE_SECRET_CHAIN_ID) {
                console.log(`getting balance for ${account}`);
                getScrtBalance(secretjs, account).then((balance) => {
                    if (balance) {
                        setScrtBalance(balance);
                    }
                });
            } else {
                setScrtBalance(undefined);
            }
        }
    }, [secretjs, account]);

    const setupSecretJS = async (chainId?: string) => {
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

        console.log(`setting up with chain id: ${chainId}`);

        if (import.meta.env.VITE_SECRET_CHAIN_ID === chainId) {
            await setupKeplrCustomChain();
        }

        // await window.keplr.enable([
        //     "secret-4",
        //     "cosmoshub-4",
        //     import.meta.env.VITE_SECRET_CHAIN_ID,
        // ]);

        // await window.keplr.enable(import.meta.env.VITE_SECRET_CHAIN_ID);

        // Setup SecretJS with Keplr’s OfflineSigner
        // This pops-up a window for the user to sign on each tx we sent
        const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(
            chainId || import.meta.env.VITE_SECRET_CHAIN_ID,
        );
        const accounts = await keplrOfflineSigner.getAccounts();

        const secretjs = await SecretNetworkClient.create({
            rpcUrl: import.meta.env.VITE_SECRET_RPC,
            walletAddress: convertBech32(accounts[0].address, "secret"),
            chainId: chainId || import.meta.env.VITE_SECRET_CHAIN_ID,
            wallet: keplrOfflineSigner,
            encryptionUtils: window.getEnigmaUtils(
                chainId || import.meta.env.VITE_SECRET_CHAIN_ID,
            ),
        });

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
                chainId,
                setChainId,
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
