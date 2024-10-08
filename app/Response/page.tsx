"use client";

import { Box, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { blue } from "@mui/material/colors";
import { dataClient } from "@dataClient";
import ResponseLanding from "./ResponseLanding";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import styles from "./styles";
import Head from "next/head";
import { Metadata } from "next";
import { ConfirmProvider, ConfirmProviderProps } from "material-ui-confirm";
import { Suspense } from "react";

const queryClient = new QueryClient();
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

const confirmOptions: ConfirmProviderProps["defaultOptions"] = {
    confirmationText: "Ok",
    cancellationText: "Abbrechen",
    title: "Bestätigung",
};

export default function Page() {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <ConfirmProvider defaultOptions={confirmOptions}>
                    <Box
                        id="ResponseLandingPage"
                        sx={styles}
                    >
                        <Suspense>
                            <ResponseLanding />
                        </Suspense>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </Box>
                </ConfirmProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
