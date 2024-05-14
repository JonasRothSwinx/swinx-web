import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingProps {
    textMessage?: string;
    spinnerSize?: number;
}
export default function Loading({ textMessage, spinnerSize }: LoadingProps) {
    return (
        <Box id="LoadingContainer">
            <Typography variant="h3">{textMessage ?? "Lade"}</Typography>
            <CircularProgress size={spinnerSize ?? 20} />
        </Box>
    );
}
