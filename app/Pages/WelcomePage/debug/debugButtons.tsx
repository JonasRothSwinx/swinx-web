import dataClient from "@/app/ServerFunctions/database";
import emailClient from "@/app/Emails";
import { Box, Button, SxProps } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "@/app/utils/configuredDayJs";
import { useMemo } from "react";
import printJson from "./json";

export default function DebugButtons() {
    // const queryClient = useQueryClient();
    const styles: SxProps = useMemo(
        () => ({
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "& .MuiButton-root": {
                borderColor: "white",
                color: "white",
            },
        }),
        [],
    );
    return (
        <Box sx={styles}>
            <Button
                variant="outlined"
                onClick={async () => {
                    console.log("Update Templates");
                    try {
                        await emailClient.templates.update(["CampaignInviteNew"]);
                        console.log("Templates Updated");
                    } catch (error) {
                        console.error("Error updating templates", error);
                    }
                    // console.log(response);
                }}
            >
                Update Templates
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    const templateName = prompt("TemplateName");
                    if (!templateName) return;
                    const response = await emailClient.templates.get({ templateName });
                    console.log(response);
                }}
            >
                Get Template
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    const response = await emailClient.templates.list();
                    console.log(response);
                }}
            >
                List Templates
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    const templateName = prompt("TemplateName");
                    if (!templateName) return;
                    const response = await emailClient.templates.delete({
                        templateNames: [templateName],
                    });
                    console.log(response);
                }}
            >
                Delete Template
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    const start = dayjs().subtract(1, "year");
                    const end = dayjs().add(1, "year");
                    const response = await dataClient.emailTrigger.inRange({
                        startDate: start,
                        endDate: end,
                    });
                    console.log(
                        "Events in range",
                        start.format("DD.MM"),
                        end.format("DD.MM"),
                        response,
                    );
                }}
            >
                Test Email Triggers
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    printJson();
                }}
            >
                TESTJSON
            </Button>
        </Box>
    );
}
