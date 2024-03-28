"use client";
import UserView from "@/app/Pages/WelcomePage/User";
import { useEffect, useState } from "react";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import stylesExporter from "../styles/stylesExporter";
import { Button } from "@mui/material";
import {
    sendTemplateAPITest,
    sendTestBulkTemplate,
    sendTestMail,
    sendTestTemplate,
} from "@/app/ServerFunctions/email/invites";
import emailClient from "@/app/ServerFunctions/email/emailClient";
import { inviteTemplateVariables } from "@/app/ServerFunctions/email/templates/invites/invitesTemplate";
import { testLambda } from "@/app/ServerFunctions/email/templates/templateFunctions";
import { createTestData, listCampaignsTest, wipeTestData } from "@/app/ServerFunctions/database/test";
import { useQueries, useQueryClient } from "@tanstack/react-query";

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
                                prompt("TemplateName") ?? "CampaignInvite"
                            );
                            console.log(response);
                        }}
                    >
                        Get Template
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await sendTemplateAPITest();
                            console.log(response);
                        }}
                    >
                        Send Template
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await testLambda();
                            console.log(response);
                        }}
                    >
                        Test Lambda
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await createTestData();
                            console.log(response);
                            queryClient.invalidateQueries({ queryKey: ["campaigns"] });
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
                        }}
                    >
                        Wipe Test Data
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            const response = await listCampaignsTest();
                            console.log(response);
                        }}
                    >
                        List Campaigns Test
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
