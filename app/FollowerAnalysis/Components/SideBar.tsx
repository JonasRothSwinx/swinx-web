import { Box, SxProps } from "@mui/material";

export default function SideBar() {
    const styles: SxProps = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        flex: "1",
        minWidth: "fit-content",
        maxWidth: "fit-content",
        padding: "10px",
        overflow: "hidden",
        textWrap: "wrap",
        wordBreak: "break-word",
    };
    return (
        <Box id="SideBar" sx={styles}>
            <h1>Side Bar</h1>
        </Box>
    );
}
