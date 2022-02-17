import React from "react";
// import { Web3ContextWrapper } from "./useEth";
import { SecretContext } from "./useSecret";

const ContextProvider: React.FC<{ children: any }> = ({ children }) => {
    return (
        <SecretContext>
            {children}
            {/*<Web3ContextWrapper>{children}</Web3ContextWrapper>*/}
        </SecretContext>
    );
};

export default ContextProvider;
