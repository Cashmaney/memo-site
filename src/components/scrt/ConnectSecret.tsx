import React from "react";
import KeplrButton from "./KeplrButton";
import { useSecret } from "../../hooks/useSecret";

const ConnectSecret: React.FC<{
    className?: string;
    clickAction?: CallableFunction;
    chainId?: string;
}> = (props: {
    className?: string;
    clickAction?: CallableFunction;
    chainId?: string;
}) => {
    const { setupSecretJS, secretjs, account } = useSecret();

    const initKeplr = async () => {
        if (!secretjs) {
            await setupSecretJS(props.chainId);
        }

        if (!account) {
            return;
        }

        props.clickAction && props.clickAction();
    };

    // useEffect(() => {
    //     initKeplr();
    // }, []);

    return (
        <div className={props?.className}>
            <KeplrButton onClick={initKeplr} address={account} />
        </div>
    );
};

export default ConnectSecret;
