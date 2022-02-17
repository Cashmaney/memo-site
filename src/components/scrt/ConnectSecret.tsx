import React from "react";
import KeplrButton from "./KeplrButton";
import { useSecret, getPermitFromUser } from "../../hooks/useSecret";
import { PERMIT_NAME, PERMIT_PERMISSION } from "../../contracts/scrt/memo";

const ConnectSecret: React.FC<{
    className?: string;
    clickAction?: CallableFunction;
}> = (props: { className?: string; clickAction?: CallableFunction }) => {
    const { setupSecretJS, secretjs, account } = useSecret();

    const initKeplr = async () => {
        if (!secretjs) {
            await setupSecretJS();
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
