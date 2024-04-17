"use client";
import UserView from "@/app/Pages/WelcomePage/User";
import { useEffect, useState } from "react";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import stylesExporter from "../styles/stylesExporter";
import { Button } from "@mui/material";
import emailClient from "@/app/ServerFunctions/email";
import {
    createTestData,
    listCampaignsTest,
    wipeTestData,
} from "@/app/ServerFunctions/database/dbOperations/test";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import dataClient from "@/app/ServerFunctions/database";
import dayjs from "@/app/utils/configuredDayJs";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";

const styles = stylesExporter.sideBar;

export interface ISideBarButton {
    id: sideBarButtonId;
    title: string;
    description: string;
    allowedGroups: string[];
    link?: string;
}
export enum sideBarButtonId {
    campaigns,
    influencers,
}
export const sideBarButtons = [
    {
        id: sideBarButtonId.campaigns,
        title: "Kampagnen",
        description: "Campaign Menu Description placeholder",
        allowedGroups: ["admin", "projektmanager"],
    },
    {
        id: sideBarButtonId.influencers,
        title: "Influencer",
        description: "Influencer Menu Description placeholder",
        allowedGroups: ["admin", "projektmanager"],
    },
];
interface ISideBar {
    setMenuCallback?: (menu: sideBarButtonId) => unknown;
}

function SideBar(props: ISideBar) {
    const queryClient = useQueryClient();
    const { setMenuCallback } = props;
    const [groups, setGroups] = useState<string[]>([]);
    useEffect(() => {
        getUserGroups().then((result) => setGroups(result));
        return () => {};
    }, []);

    return (
        <div className={styles.sideBar}>
            <UserView />
            {sideBarButtons.map((sb) => (
                <SideBarButton
                    key={sb.id.toString()}
                    buttonProps={sb}
                    groups={groups}
                    callback={setMenuCallback ?? (() => {})}
                />
            ))}
            {groups.includes("admin") && (
                <>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await emailClient.templates.update();
                            console.log(response);
                        }}
                    >
                        Update Templates
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await emailClient.templates.get(
                                prompt("TemplateName") ?? "CampaignInvite",
                            );
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
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await createTestData();
                            console.log(response);
                            queryClient.invalidateQueries({ queryKey: ["campaigns"] });
                            queryClient.refetchQueries({ queryKey: ["campaigns"] });
                        }}
                    >
                        Create Test Data
                    </Button>{" "}
                    <Button
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
                    </Button>
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
                </>
            )}
        </div>
    );
}
export default SideBar;

function SideBarButton(props: {
    buttonProps: ISideBarButton;
    groups: string[];
    callback: (menu: sideBarButtonId) => unknown;
}) {
    const { id, title, description, allowedGroups } = props.buttonProps;
    const { groups, callback } = props;
    if (!allowedGroups.some((x) => groups.includes(x))) return null;

    return (
        <button id={id.toString()} className={styles.sideBarButton} onClick={() => callback(id)}>
            <h2>
                <span>&lt;-</span> {title}
            </h2>
            <p>{description}</p>
        </button>
    );
}
