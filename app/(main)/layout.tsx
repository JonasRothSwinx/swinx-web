"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dataClient } from "@dataClient";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { ConfigureAmplifyClientSide } from "../Components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfirmProvider } from "material-ui-confirm";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { queryKeys } from "./queryClient/keys";
import { getEnvironment, getUserGroups } from "../ServerFunctions/serverActions";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // staleTime: Infinity,
            retry: true,
        },
    },
});
queryClient.setQueryData(queryKeys.campaignList.settings(), { showManagerIds: [] });
dataClient.config.init(queryClient);
const theme = createTheme({
    palette: {
        primary: {
            main: "#2867b2",
        },
        // secondary: { main: "#ffffff" },W
    },
    shape: { borderRadius: 20 },
});
const ReactQueryDevtoolsProduction = React.lazy(() =>
    import("@tanstack/react-query-devtools/production").then((d) => ({
        default: d.ReactQueryDevtools,
    })),
);

function Layout({ children }: { children: React.ReactNode }) {
    const [showDevTools, setShowDevTools] = React.useState(false);
    const [environment, setEnvironment] =
        React.useState<Awaited<ReturnType<typeof getEnvironment>>>();
    useEffect(() => {
        getUserGroups().then((groups) => {
            setShowDevTools(groups.includes("admin"));
        });
        getEnvironment().then((env) => {
            setEnvironment(env);
        });
    }, []);

    return (
        <>
            {/* <ThemeProvider theme={theme}> */}
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
                        {environment && environment.awsBranch === "sandbox" ? (
                            <ReactQueryDevtools initialIsOpen={false} />
                        ) : (
                            showDevTools && (
                                <React.Suspense fallback={null}>
                                    <ReactQueryDevtoolsProduction />
                                </React.Suspense>
                            )
                        )}
                        {children}
                    </ConfirmProvider>
                </QueryClientProvider>
            </Authenticator.Provider>
            {/* </ThemeProvider> */}
        </>
    );
}
export default withAuthenticator(Layout);
