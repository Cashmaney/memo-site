import Paper from "@mui/material/Paper";
import { IconButton, Typography, useTheme } from "@mui/material";
import { toDisplayAddress } from "../../../utils/address";
import Button from "@mui/material/Button";
import React from "react";
import { useSecret } from "../../../hooks/useSecret";
import { PERMIT_NAME } from "../../../contracts/scrt/memo";
import NetworkSelect from "./NetworkSelect";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import { If, Then } from "react-if";
import { styled } from "@mui/system";
import { grey } from "../../../utils/colors";

const StyledBox = styled("div")(
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
  margin-left: 0.5em;
  &:hover {
    background: ${theme.palette.mode === "dark" ? "" : grey[100]};
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }
  `,
);

function Navbar() {
    const { account, deletePermit } = useSecret();
    const theme = useTheme();

    return (
        <Paper
            style={{
                display: "flex",
                justifySelf: "center",
                justifyContent: account ? "space-between" : "center",
                marginBottom: "3rem",
                paddingTop: "15px",
                paddingBottom: "15px",
                maxWidth: "1920px",
                width: "80vw",
                marginLeft: "9vw",
            }}
        >
            <If condition={account}>
                <Then>
                    <Box
                        sx={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <StyledBox
                        // sx={{
                        //     alignItems: "center",
                        //     background: "#1A2027",
                        //     height: "3rem",
                        //     width: "150px",
                        //     borderRadius: 10,
                        //     justifyContent: "center",
                        //     display: "flex",
                        // }}
                        >
                            {toDisplayAddress(account)}
                            {/*<Typography*/}
                            {/*    variant={"button"}*/}
                            {/*    sx={{ fontSize: "1rem" }}*/}
                            {/*>*/}
                            {/*    */}
                            {/*</Typography>*/}
                        </StyledBox>
                        <Box sx={{ m: 2 }}>
                            <NetworkSelect />
                        </Box>
                    </Box>
                </Then>
            </If>

            <If condition={account}>
                <Then>
                    <IconButton
                        onClick={() => {
                            deletePermit(PERMIT_NAME);
                        }}
                        sx={{ p: 2, m: 2 }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Then>
            </If>
        </Paper>
    );
}

export default Navbar;
