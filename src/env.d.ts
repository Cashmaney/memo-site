interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_SECRET_CHAIN_ID: string;
    readonly VITE_SECRET_LCD: string;
    readonly VITE_SECRET_RPC: string;
    readonly VITE_SECRET_GRPC: string;
    readonly VITE_SECRET_CHAIN_NAME: string;

    readonly VITE_MEMO_CONTRACT_ADDRESS: string;
    readonly VITE_MEMO_CONTRACT_CODE_HASH: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
