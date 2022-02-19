// import { CosmWasmClient } from "secretjs";

import { SecretNetworkClient } from "secretjs";

export const GetContractCodeHash = async ({
    secretjs,
    address,
}: {
    secretjs: SecretNetworkClient;
    address: string;
}): Promise<string> => {
    return await secretjs.query.compute.contractCodeHash(address);
};

export const setupKeplrCustomChain = async () => {
    if (!window || !window.keplr) {
        return;
    }

    await window.keplr.experimentalSuggestChain({
        chainId: import.meta.env.VITE_SECRET_CHAIN_ID,
        chainName: import.meta.env.VITE_SECRET_CHAIN_NAME || "secretdev",
        rpc: import.meta.env.VITE_SECRET_RPC,
        rest: import.meta.env.VITE_SECRET_LCD,
        bip44: {
            coinType: 529,
        },
        coinType: 529,
        stakeCurrency: {
            coinDenom: "SCRT",
            coinMinimalDenom: "uscrt",
            coinDecimals: 6,
        },
        bech32Config: {
            bech32PrefixAccAddr: "secret",
            bech32PrefixAccPub: "secretpub",
            bech32PrefixValAddr: "secretvaloper",
            bech32PrefixValPub: "secretvaloperpub",
            bech32PrefixConsAddr: "secretvalcons",
            bech32PrefixConsPub: "secretvalconspub",
        },
        currencies: [
            {
                coinDenom: "SCRT",
                coinMinimalDenom: "uscrt",
                coinDecimals: 6,
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "SCRT",
                coinMinimalDenom: "uscrt",
                coinDecimals: 6,
            },
        ],
        gasPriceStep: {
            low: 0.01,
            average: 0.25,
            high: 0.25,
        },
        features: ["secretwasm"],
    });
};
