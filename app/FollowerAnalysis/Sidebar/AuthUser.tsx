import { useAuthenticator } from "@aws-amplify/ui-react";
import { Box, Typography } from "@mui/material";

export default function AuthUser() {
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    return (
        <Box id="AuthUser">
            <Typography>{user.signInDetails?.loginId}</Typography>
        </Box>
    );
}
