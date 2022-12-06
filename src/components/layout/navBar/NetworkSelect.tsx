import * as React from "react";
import PropTypes from "prop-types";
import SelectUnstyled, {
    selectUnstyledClasses,
    SelectUnstyledProps,
} from "@mui/base/SelectUnstyled";
import OptionUnstyled, {
    optionUnstyledClasses,
} from "@mui/base/OptionUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
import { useSecret } from "../../../hooks/useSecret";
import { grey, blue } from "../../../utils/colors";

//, sans-serif
const StyledButton = styled("button")(
    ({ theme }) => `
  font-family: Inter, sans-serif; 
  font-size: 1.2rem;

  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.5em;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  min-width: 150px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[300]};
  border-radius: 0.75em;
  margin-top: 0.5em;
  padding: 10px;
  text-align: left;
  line-height: 1.5;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};

  &:hover {
    background: ${theme.palette.mode === "dark" ? "" : grey[100]};
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[100]};
  }

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }
  `,
);

const StyledListbox = styled("ul")(
    ({ theme }) => `
  font-family: Inter, sans-serif;
  font-size: 1.2rem;
  box-sizing: border-box;
  padding: 5px;
  margin: 10px 0;
  min-width: 220px;
  
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[300]};
  border-radius: 0.75em;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  overflow: auto;
  outline: 0px;
  `,
);

const StyledOption = styled(OptionUnstyled)(
    ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 0.45em;
  cursor: default;
  gap: 0.5em;
  display: flex;
  align-items: center;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : blue[100]};
    color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : blue[100]};
    color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }
  `,
);

const StyledPopper = styled(PopperUnstyled)`
    z-index: 1;
`;


// eslint-disable-next-line @typescript-eslint/ban-types
function CustomSelect(props: SelectUnstyledProps<string>) {
    const slots: SelectUnstyledProps<string>["slots"] = {
        root: StyledButton,
        listbox: StyledListbox,
        popper: StyledPopper,
        ...props.slots,
    };

    return <SelectUnstyled {...props} slots={slots} />;
}

interface Network {
    chainId: string;
    displayName: string;
    id: string;
    img: string;
}

const networks: Network[] = [
    {
        chainId: "secret-4",
        displayName: "Secret",
        id: "secret",
        img: "/icons/scrt.svg",
    },
    {
        chainId: "cosmoshub-4",
        displayName: "Cosmoshub",
        id: "cosmoshub",
        img: "/icons/atom.png",
    },
    {
        chainId: "juno-1",
        displayName: "Juno",
        id: "juno",
        img: "/icons/juno.svg",
    },
    {
        chainId: "osmosis-1",
        displayName: "Osmosis",
        id: "osmosis",
        img: "/icons/osmosis.svg",
    },
];

export default function NetworkSelect() {
    const { setChainId } = useSecret();
    const [network, setNetwork] = React.useState(
        import.meta.env.VITE_SECRET_CHAIN_ID,
    );

    const handleChange = (value: string | null) => {
        if (value) {
            setNetwork(value);
            setChainId(value);
        }

        // location.reload();
    };

    return (
        <div>
            <CustomSelect
                value={network}
                onChange={(_evt, value) => {
                    handleChange(value);
                }}
            >
                <StyledOption value={""} disabled>
                    Select A Network
                </StyledOption>
                {networks.map((net) => {
                    return (
                        <StyledOption key={net.id} value={net.chainId}>
                            <img
                                loading="lazy"
                                width="20"
                                src={net.img}
                                alt={`Image`}
                            />
                            {net.displayName}
                        </StyledOption>
                    );
                })}
                {import.meta.env.MODE !== "production" ? (
                    <StyledOption
                        key={"pulsar-2"}
                        value={import.meta.env.VITE_SECRET_CHAIN_ID}
                    >
                        <img
                            loading="lazy"
                            width="20"
                            src={"/icons/scrt.svg"}
                            alt={`Image`}
                        />
                        {"Testnet"}
                    </StyledOption>
                ) : null}
            </CustomSelect>
        </div>
    );
}

// const NetworkSelect = () => {
//     return (
//         <FormControl fullWidth>
//             <InputLabel id="network-select-label">Network</InputLabel>
//             <Select>
//                 <MenuItem value={"secret-4"}>Secret</MenuItem>
//                 <MenuItem value={"cosmoshub-4"}>Cosmos</MenuItem>
//                 <MenuItem value={"pulsar-2"}>Secret Testnet</MenuItem>
//             </Select>
//         </FormControl>
//     );
// };

// export default NetworkSelect;
