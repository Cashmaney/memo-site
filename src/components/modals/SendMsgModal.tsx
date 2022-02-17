import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import SendMsgForm from "../forms/SendMsgForm";
import Box from "@mui/material/Box";
import { isMobile } from "react-device-detect";
import { Fade } from "@mui/material";
import Button from "@mui/material/Button";

const style = isMobile
    ? ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "80%",
          width: "95%",
          maxWidth: "400px",
          bgcolor: "white",
          // overflowY: "auto",
          border: "1px solid rgb(255, 199, 1)",
          borderRadius: 10,
          boxShadow: 24,
      } as const)
    : ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          width: "600px",
          maxHeight: "100vh",
          overflowY: "auto",
          border: "1px solid rgb(255, 199, 1)",
          borderRadius: 10,
          boxShadow: 24,
          p: 4,
      } as const);

export default function SendMsgModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button
                onClick={handleOpen}
                style={{
                    display: "flex",
                    placeContent: "center",
                    placeItems: "center",
                    lineHeight: "unset",
                }}
            >
                <div>Send Memo</div>
            </Button>
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
