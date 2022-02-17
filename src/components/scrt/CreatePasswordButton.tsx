import React from "react";
import Button from "@mui/material/Button";
import { useSecret, getPermitFromUser } from "../../hooks/useSecret";
import { PERMIT_NAME, PERMIT_PERMISSION } from "../../contracts/scrt/memo";

const CreatePasswordButton: React.FC = () => {
    const { secretjs, account } = useSecret();

    return (
        <>
            <Button
                onClick={async () => {
                    if (!account || !secretjs) {
                        return;
                    }
                    getPermitFromUser(
                        account,
                        PERMIT_NAME,
                        [import.meta.env.VITE_MEMO_CONTRACT_ADDRESS],
                        PERMIT_PERMISSION,
                    )
                        .then(() => {
                            console.log("yay");
                        })
                        .catch(() => {
                            console.log("aww");
                        });
                }}
            >
                Create Password
            </Button>
        </>
    );
};

export default CreatePasswordButton;
