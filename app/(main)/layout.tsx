"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dataClient } from "@/app/ServerFunctions/database";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { ConfigureAmplifyClientSide } from "../Components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfirmProvider } from "material-ui-confirm";
import { Box, createTheme, ThemeProvider } from "@mui/material";
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
const theme = createTheme({
    palette: {
        primary: {
            main: "#2867b2",
        },
        // secondary: { main: "#ffffff" },W
    },
    shape: { borderRadius: 20 },
});

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider theme={theme}>
                <ConfigureAmplifyClientSide />
                <Authenticator.Provider>
                    <QueryClientProvider client={queryClient}>
                        <ConfirmProvider
                            defaultOptions={{
                                confirmationText: "Ok",
                                cancellationText: "Abbrechen",
                                title: "Bestätigung",
                                contentProps: {
                                    sx: {
                                        "&": {
                                            ".MuiTypography-root": {
                                                whiteSpace: "pre-wrap",
                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <ReactQueryDevtools initialIsOpen={false} />
                            {children}
                        </ConfirmProvider>
                    </QueryClientProvider>
                </Authenticator.Provider>
            </ThemeProvider>
        </>
    );
}
export default withAuthenticator(Layout);
