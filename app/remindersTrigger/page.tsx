"use client";

import { useEffect, useState } from "react";
import { log } from "./logger";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import reminderProcessor from "../ServerFunctions/reminders";
import Processor from "./pages/Processor";
import { blue } from "@mui/material/colors";
import dataClient from "../ServerFunctions/database";

const queryClient = new QueryClient();
dataClient.config.setQueryClient(queryClient);
const theme = createTheme({
    palette: {
        primary: {
            main: blue[500],
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
