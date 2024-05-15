"use client";

import { Box, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { blue } from "@mui/material/colors";
import dataClient from "../ServerFunctions/database";
import ResponseLanding from "./Components/ResponseLanding";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import styles from "./styles";

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

export default function Page() {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Box id="ResponseLandingPage" sx={styles}>
                    <ResponseLanding />
                    <ReactQueryDevtools initialIsOpen={false} />
                </Box>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
