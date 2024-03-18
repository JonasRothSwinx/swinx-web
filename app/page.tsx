"use client";
import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import WelcomePage from "./Pages/WelcomePage/WelcomePage";
import { ThemeProvider } from "@emotion/react";

import { blue, red } from "@mui/material/colors";
import { CssBaseline, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        // secondary: { main: "#ffffff" },W
    },
    shape: { borderRadius: 20 },
});
const queryClient = new QueryClient();

function Home() {
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Authenticator.Provider>
                <QueryClientProvider client={queryClient}>
                    {authStatus === "authenticated" && <WelcomePage />}
                </QueryClientProvider>
            </Authenticator.Provider>
        </ThemeProvider>
    );
}
export default withAuthenticator(Home);
