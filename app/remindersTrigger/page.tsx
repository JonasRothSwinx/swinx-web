"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dataClient } from "@/app/ServerFunctions/database";
import Processor from "./pages/Processor";

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
                <Processor />
            </QueryClientProvider>
        </ThemeProvider>
    );
}
