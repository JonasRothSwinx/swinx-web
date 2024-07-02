"use client";
import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { ThemeProvider } from "@emotion/react";
import WelcomePage from "./Main Menu/WelcomePage/WelcomePage";

import { createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConfirmProvider } from "material-ui-confirm";
import { dataClient } from "@/app/ServerFunctions/database";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2867b2",
        },
        // secondary: { main: "#ffffff" },W
    },
    shape: { borderRadius: 20 },
});
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // staleTime: Infinity,
            retry: true,
        },
    },
});
dataClient.config.setQueryClient(queryClient);

function Home() {
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Authenticator.Provider>
                <ConfirmProvider
                    defaultOptions={{
                        confirmationText: "Ok",
                        cancellationText: "Abbrechen",
                        title: "Bestätigung",
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        {authStatus === "authenticated" && <WelcomePage />}
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </ConfirmProvider>
            </Authenticator.Provider>
        </ThemeProvider>
    );
}
export default withAuthenticator(Home);
