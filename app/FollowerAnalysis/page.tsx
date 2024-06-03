"use client";

import { Box, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { blue } from "@mui/material/colors";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import FollowerAnalysis from "./Landing";
import AuthError from "./Components/AuthError";
import { ConfirmProvider } from "material-ui-confirm";
import SideBar from "./Components/SideBar";

const queryClient = new QueryClient();
const theme = createTheme({
    palette: {
        primary: {
            main: "#2867b2",
        },
        // secondary: { main: "#ffffff" },W
    },
    shape: { borderRadius: 20 },
});

function Page() {
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    const style = {
        "&": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "stretch",
            width: "100dvw",
            height: "100dvh",
            maxHeight: "100vh",
            overflow: "hidden",
        },
    };
    if (!user || authStatus !== "authenticated") return <AuthError />;
    return (
        <ThemeProvider theme={theme}>
            <Authenticator.Provider>
                <ConfirmProvider
                    defaultOptions={{
                        confirmationText: "Ok",
                        cancellationText: "Abbrechen",
                        title: "Bestätigung",
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <Box id="FollowerAnalysisPage" sx={style}>
                            <FollowerAnalysis />
                            <SideBar />
                        </Box>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </ConfirmProvider>
            </Authenticator.Provider>
        </ThemeProvider>
    );
}
export default withAuthenticator(Page);
