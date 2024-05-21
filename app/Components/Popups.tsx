//Version of window.alert using MUI components

import { Box, Button, ButtonGroup, Dialog, Typography } from "@mui/material";

interface AlertProps {
    message: string;
    onClose: () => void;
    severity: "error" | "info" | "success" | "warning";
}
export function Alert(props: AlertProps) {
    return (
        <Dialog open={true}>
            <Typography>{props.message}</Typography>
            <Button onClick={props.onClose} color="primary">
                OK
            </Button>
        </Dialog>
    );
}

interface confirmProps {
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
}
export function Confirm(props: confirmProps) {
    function onCancel() {
        props.onCancel();
        props.onClose();
    }
    function onConfirm() {
        props.onConfirm();
        props.onClose();
    }
    return (
        <Dialog
            open={true}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 20px",
                }}
            >
                <Typography variant="h2">{props.title}</Typography>
                <Typography>{props.message}</Typography>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Button onClick={(e) => onCancel()} color="primary">
                        Abbrechen
                    </Button>
                    <Button onClick={(e) => onConfirm()} color="primary">
                        OK
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
