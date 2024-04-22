import dataClient from "@/app/ServerFunctions/database";
import { createTestData, wipeTestData } from "@/app/ServerFunctions/database/dbOperations/test";
import emailClient from "@/app/ServerFunctions/email";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "@/app/utils/configuredDayJs";
import templateDefinitions from "@/app/ServerFunctions/email/templates";

export default function DebugButtons() {
    const queryClient = useQueryClient();
    return (
        <>
            <Button
                variant="outlined"
                onClick={async () => {
                    console.log("Update Templates");
                    try {
                        await emailClient.templates.update();
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
                    const response = await emailClient.templates.get(prompt("TemplateName") ?? "CampaignInvite");
                    console.log(response);
                }}
            >
                Get Template
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    const response = await emailClient.email.campaignInvites.send({
                        level: "new",
                        context: {
                            candidates: [
                                {
                                    influencer: {
                                        id: "testID",
                                        firstName: "Test",
                                        lastName: "Influencer",
                                        email: "jonasroth1@gmail.com",
                                    },
                                    id: "testID",
                                    response: "pending",
                                },
                            ],
                            taskDescriptions: ["Test Task"],
                        },
                    });

                    console.log(response);
                }}
            >
                Send Template
            </Button>
            {/* <Button
                variant="outlined"
                onClick={async () => {
                    const response = await createTestData();
                    console.log(response);
                    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
                    queryClient.refetchQueries({ queryKey: ["campaigns"] });
                }}
            >
                Create Test Data
            </Button>{" "} */}
            {/* <Button
                variant="outlined"
                onClick={async () => {
                    queryClient.setQueryData(["campaigns"], []);
                    const response = await wipeTestData();
                    console.log(response);
                    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
                    queryClient.refetchQueries({ queryKey: ["campaigns"] });
                }}
            >
                Wipe Test Data
            </Button> */}
            <Button
                variant="outlined"
                onClick={async () => {
                    const response = await dataClient.campaign.list();
                    console.log(response);
                }}
            >
                List Campaigns
            </Button>
            {/* Liust events */}
            <Button
                variant="outlined"
                onClick={async () => {
                    const response = await dataClient.timelineEvent.list();
                    console.log(response);
                }}
            >
                List Events
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    const env = process.env;
                    console.log(env);
                }}
            >
                Print env
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
            <Button
                variant="outlined"
                onClick={async () => {
                    const assignments = await dataClient.assignment.list();
                    console.log({ assignments });
                    const events = await dataClient.timelineEvent.byAssignment(assignments[0].id);
                    console.log({ events });
                }}
            >
                Test EventByAssignment
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    const html = await templateDefinitions.mailTypes.campaignInvite.CampaignInvite.levels.new.html;
                    console.log(html);
                }}
            >
                Test Email rendering
            </Button>
        </>
    );
}
