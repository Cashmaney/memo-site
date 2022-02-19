import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import SendMsgForm from "../forms/SendMsgForm";
import Box from "@mui/material/Box";
import { isMobile } from "react-device-detect";
import { Fade, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSecret } from "../../hooks/useSecret";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "../../utils/colors";

const style = isMobile
    ? ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "80%",
          width: "95%",
          maxWidth: "400px",
          bgcolor: grey[900],
          // overflowY: "auto",
          border: "1px solid",
          borderColor: grey[800],
          borderRadius: 10,
          boxShadow: 24,
      } as const)
    : ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: grey[900],
          width: "600px",
          maxHeight: "100vh",
          overflowY: "auto",
          border: "1px solid",
          borderColor: grey[800],
          borderRadius: 10,
          boxShadow: 24,
          p: 4,
      } as const);

export default function SendMsgModal() {
    const theme = useTheme();
    const { chainId } = useSecret();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        if (chainId !== import.meta.env.VITE_SECRET_CHAIN_ID) {
            toast.error("You can only whisper from a Secret address");
        } else {
            setOpen(true);
        }
    };
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box
                onClick={handleOpen}
                // variant={"contained"}
                // sx={{
                //     borderRadius: "50%",
                //     p: 2,
                //     m: 2,
                //     width: "1.5rem",
                // }}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: theme.palette.primary.main,
                    borderRadius: "50%",
                    p: 2,
                    m: 2,
                    width: "4rem",
                    height: "4rem",
                    boxShadow:
                        "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;",
                    "&:hover": {
                        background: grey[800],
                        boxShadow:
                            "rgba(0, 0, 0, 0.17) 0px -10px 12px 0px inset, rgba(0, 0, 0, 0.15) 0px -18px 15px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;",
                    },
                }}
            >
                <AddIcon />
            </Box>
            <Modal
                sx={{ zIndex: 10 }}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <SendMsgForm handleClose={handleClose} />
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}
