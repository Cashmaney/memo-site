import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Message } from "../../contracts/scrt/memo";
import { Skeleton, Typography } from "@mui/material";

const BasicTable: React.FC<{
    messages: Message[];
    loading: boolean;
}> = (props: { messages: Message[]; loading: boolean }) => {
    return (
        <TableContainer
            component={Paper}
            sx={{ display: "flex", maxWidth: "80%", marginLeft: "10%" }}
        >
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>From</TableCell>
                        <TableCell align="left" sx={{ width: "80%" }}>
                            Message
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.loading ? (
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <Skeleton width="100%" />{" "}
                            </TableCell>
                            <TableCell align="left">
                                <Skeleton width="100%" />{" "}
                            </TableCell>
                        </TableRow>
                    ) : (
                        props.messages.map((row) => (
                            <TableRow
                                key={`${row.from}${row.block_time}`}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.from}
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant={"caption"}>
                                        {new Date(
                                            row.block_time * 1000,
                                        ).toDateString()}{" "}
                                        {new Date(
                                            row.block_time * 1000,
                                        ).toTimeString()}
                                    </Typography>

                                    <br />
                                    <Typography variant={"body1"}>
                                        {row.message}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BasicTable;
