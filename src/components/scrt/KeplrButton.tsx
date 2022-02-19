import * as React from "react";
import styled from "@emotion/styled";
import { MouseEventHandler } from "react";
import Button from "@mui/material/Button";
import { toDisplayAddress } from "../../utils/address";

const SConnectButtonContainer = styled.div`
    position: relative;
    width: 100%;
    height: auto;
    max-width: 224px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

interface IConnectButtonStyleProps {
    disabled: boolean;
    icon?: string;
}

interface IConnectButtonProps extends IConnectButtonStyleProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    address?: string;
}

const SHoverLayer = styled.div`
    transition: all 0.15s ease-in-out;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgb(255, 255, 255, 0.1);
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
`;

const KeplrButton = (props: IConnectButtonProps) => (
    <SConnectButtonContainer>
        <Button
            onClick={props.onClick}
            disabled={props.disabled}
            variant={"contained"}
            sx={{
                borderRadius: 15,
                p: 2,
                boxShadow:
                    "inset 0 0 50px #fff, /* inner white */ \
                inset 20px 0 80px #f0f,   /* inner left magenta short */ \
                inset -20px 0 80px #0ff,  /* inner right cyan short */ \
                inset 20px 0 300px #f0f,  /* inner left magenta broad */ \
                inset -20px 0 300px #0ff, /* inner right cyan broad */ \
                0 0 50px #fff,            /* outer white */ \
                -10px 0 80px #f0f,        /* outer left magenta */ \
                10px 0 80px #0ff;         /* outer right cyan */",
                ":hover": {
                    boxShadow:
                        "inset 0 0 50px #fff, /* inner white */ \
                    inset 20px 0 80px #f0f,   /* inner left magenta short */ \
                    inset -20px 0 80px #0ff,  /* inner right cyan short */ \
                    inset 20px 0 300px #f0f,  /* inner left magenta broad */ \
                    inset -20px 0 300px #0ff, /* inner right cyan broad */ \
                    0 0 50px #fff,            /* outer white */ \
                    -10px 0 80px #f0f,        /* outer left magenta */ \
                    10px 0 80px #0ff;         /* outer right cyan */",
                },
            }}
        >
            <div
                style={{
                    display: "flex",
                    placeItems: "center",
                    placeContent: "space-evenly",
                }}
            >
                <SHoverLayer />

                {toDisplayAddress(props?.address) || "Connect Wallet"}
            </div>
        </Button>
    </SConnectButtonContainer>
);

KeplrButton.defaultProps = {
    disabled: false,
    icon: null,
};

export default KeplrButton;
