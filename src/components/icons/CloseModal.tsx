import React from "react";

const CloseModalIcon: React.FC<{
    className?: string;
    onClick: React.MouseEventHandler<SVGSVGElement>;
}> = (props: {
    className?: string;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}) => {
    return (
        <a>
            <svg
                onClick={props.onClick}
                className={props?.className}
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: "pointer" }}
            >
                <path
                    d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4L14.6 16L8 22.6L9.4 24L16 17.4L22.6 24L24 22.6L17.4 16L24 9.4Z"
                    fill="white"
                />
            </svg>
        </a>
    );
};

export default CloseModalIcon;
