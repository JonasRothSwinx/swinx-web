import dataClient from "@/app/ServerFunctions/database";
import emailClient from "@/app/Emails";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "@/app/utils/configuredDayJs";

export default function DebugButtons() {
    // const queryClient = useQueryClient();
    return (
        <>
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
                    const start = dayjs().subtract(1, "day");
                    const end = dayjs().add(1, "year");
                    const response = await dataClient.emailTrigger.inRange({
                        startDate: start,
                        endDate: end,
                    });
                    console.log("Events in range", start.toLocaleString(), end, response);
                }}
            >
                Test Email Triggers
            </Button>
        </>
    );
}
