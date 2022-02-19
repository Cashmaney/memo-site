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

const Paragraph = styled("p")(
    ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  margin: 10px 0;
  color: ${theme.palette.mode === "dark" ? grey[400] : grey[700]};
  `,
);

function CustomSelect(
    props: JSX.IntrinsicAttributes &
        SelectUnstyledProps<string> &
        React.RefAttributes<HTMLElement>,
) {
    const components = {
        Root: StyledButton,
        Listbox: StyledListbox,
        Popper: StyledPopper,
        ...props.components,
    };

    return <SelectUnstyled {...props} components={components} />;
}

CustomSelect.propTypes = {
    /**
     * The components used for each slot inside the Select.
     * Either a string to use a HTML element or a component.
     * @default {}
     */
    components: PropTypes.shape({
        Listbox: PropTypes.elementType,
        Popper: PropTypes.elementType,
        Root: PropTypes.elementType,
    }),
};

export default function NetworkSelect() {
    const { setupSecretJS, setChainId } = useSecret();
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
                onChange={(value) => {
                    handleChange(value);
                }}
            >
                <StyledOption value={""} disabled>
                    Select A Network
                </StyledOption>
                <StyledOption value={"secret-4"}>Secret</StyledOption>
                <StyledOption value={"cosmoshub-4"}>Cosmos</StyledOption>
                <StyledOption value={"pulsar-2"}>Secret Testnet</StyledOption>
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