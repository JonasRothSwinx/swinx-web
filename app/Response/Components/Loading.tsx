import { Box, CircularProgress, SxProps, Typography } from "@mui/material";
import { SwinxLogo } from "./SwinxLogo";

interface LoadingProps {
    textMessage?: string;
    spinnerSize?: number;
}
export default function Loading({ textMessage, spinnerSize }: LoadingProps) {
    const styles: SxProps = {
        "&": {
            width: "fit-content",
            margin: "auto",
            padding: "20px",
            // maxWidth: "80vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textWrap: "wrap",
            textAlign: "center",
            wordWrap: "break-word",
            borderRadius: "10px",
            border: "1px solid black",
            backgroundColor: "var(--background-color)",
            "#Spinner": {
                margin: "10px",
            },
            "#SwinxLogo": {
                marginBottom: "10px",
            },
        },
    };
    return (
        <Box id="LoadingContainer" sx={styles}>
            <SwinxLogo />
            <Typography variant="h4">{textMessage ?? "Lade"}</Typography>
            <CircularProgress id="Spinner" size={spinnerSize ?? 20} />
        </Box>
    );
}
