import { useAuthenticator } from "@aws-amplify/ui-react";
import { Box, SxProps } from "@mui/material";
import AuthUser from "./AuthUser";
import { SidebarButton } from "./Buttons/SidebarButton";
import { HomeButton } from "./Buttons";

export default function SideBar() {
    const styles: SxProps = {
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        alignItems: "flex-end",
        flex: "1",
        minWidth: "min-content",
        maxWidth: "200px",
        padding: "10px",
        overflow: "hidden",
        textWrap: "wrap",
        wordBreak: "break-word",
    };
    // const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    return (
        <Box id="SideBar" sx={styles}>
            <h1>Side Bar</h1>
            <AuthUser />
        </Box>
    );
}
