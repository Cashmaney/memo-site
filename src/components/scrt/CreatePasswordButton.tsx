import React from "react";
import Button from "@mui/material/Button";
import { useSecret, getPermitFromUser } from "../../hooks/useSecret";
import { PERMIT_NAME, PERMIT_PERMISSION } from "../../contracts/scrt/memo";
import { toast } from "react-toastify";

const CreatePasswordButton: React.FC = () => {
    const { secretjs, account } = useSecret();

    return (
        <>
            <Button
                disabled={true}
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
                        .catch((reason) => {
                            console.error(`Failed to sign permit: ${reason}`);
                            toast.error(`Failed to sign permit`);
                        });
                }}
            >
                Create Password
            </Button>
        </>
    );
};

export default CreatePasswordButton;
