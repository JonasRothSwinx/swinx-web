"use client";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import reminderProcessor from "../../ServerFunctions/reminders";

export default function Processor() {
    const finished = useQuery({
        queryKey: ["processing"],
        queryFn: async () => {
            const finished = await reminderProcessor.start();
            console.log(finished);
            return finished;
        },
        refetchOnWindowFocus: false,
        placeholderData: false,
    });

    // if (finished.isLoading) return <Box>Loading...</Box>;
    // if (finished.isError) return <Box>Error... {JSON.stringify(finished.error)}</Box>;
    // if (finished.isSuccess) return <Box>Success...</Box>;
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <h1>Reminders Trigger</h1>
            <p>Reminders Trigger is a tool to send reminders to users.</p>
            <p>
                It is a part of the <a href="/app">app</a>.
            </p>
        </Box>
    );
}
