import { Box, CircularProgress, SxProps, Typography } from "@mui/material";
import { SwinxLogo } from "./SwinxLogo";

interface LoadingProps {
    textMessage?: string;
    spinnerSize?: number;
    hideLogo?: boolean;
}
export function LoadingPage(props: LoadingProps) {
    const styles: SxProps = {
        "&.LoadingPage": {
            height: "100dvh",
            width: "100dvw",
            display: "flex",
        },
    };
    return (
        <Box
            id="LoadingPage"
            className="LoadingPage"
            sx={styles}
        >
            <LoadingElement {...props} />
        </Box>
    );
}

export function LoadingElement({ textMessage, spinnerSize, hideLogo }: LoadingProps) {
    const sx: SxProps = {
        "&.LoadingContainer": {
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
            backgroundColor: "white",
            "#Spinner": {
                margin: "10px",
            },
            "#SwinxLogo": {
                marginBottom: "10px",
            },
            "#LoadingMessage": {
                fontSize: "1.5rem",
                // fontWeight: "bold",
                // margin: "10px",
            },
        },
    };
    return (
        <Box
            id="LoadingContainer"
            className="LoadingContainer"
            sx={sx}
        >
            {!hideLogo && <SwinxLogo />}
            <Typography
                id="LoadingMessage"
                className="LoadingMessage"
            >
                {textMessage ?? "Lade"}
            </Typography>
            <CircularProgress
                id="Spinner"
                size={spinnerSize ?? 20}
            />
        </Box>
    );
}
