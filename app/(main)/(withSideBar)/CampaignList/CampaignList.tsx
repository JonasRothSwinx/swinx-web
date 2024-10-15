import { CampaignDialog } from "@/app/Components";
import { LoadingElement } from "@/app/Components/Loading";
import { dataClient } from "@dataClient";
import { Campaign } from "@/app/ServerFunctions/types";
import { Box, SxProps, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { CampaignActionButtons, GroupBy } from "./ActionBar";
import { CampaignElement, CampaignsByManager } from "./components";
import { queryKeys } from "../../queryClient/keys";
import { CampaignListSettings, CampaignListSettingsDefault } from "./config/types";

type DialogState = "none" | "campaign";
export function CampaignList2() {
    const [openDialog, setOpenDialog] = useState<DialogState>("none");
    const [groupBy, setGroupBy] = useState<GroupBy>("manager");
    const [editingData, setEditingData] = useState<Campaign>();
    const queryClient = useQueryClient();

    const currentPm = useQuery({
        queryKey: queryKeys.currentUser.projectManager(),
        queryFn: async () => {
            const pm = await dataClient.projectManager.getForUser();
            if (pm) {
                queryClient.setQueryData<CampaignListSettings>(queryKeys.campaignList.settings(), (prev) => {
                    if (!prev) return CampaignListSettingsDefault(pm.id);
                    if (prev.showManagerIds.includes(pm.id)) return prev;
                    return { ...prev, showManagerIds: [...prev.showManagerIds, pm.id] };
                });
            }
            return pm;
        },
    });
    const settings = useQuery<CampaignListSettings>({
        enabled: !!currentPm.data,
        queryKey: queryKeys.campaignList.settings(),
        queryFn: async () => {
            const settings = queryClient.getQueryData<CampaignListSettings>(queryKeys.campaignList.settings());
            if (settings && currentPm.data && !settings?.showManagerIds.includes(currentPm.data?.id)) {
                console.log("Updating settings");
                const pm = currentPm.data;
                const newSettings = CampaignListSettingsDefault(pm.id);
                queryClient.setQueryData<CampaignListSettings>(queryKeys.campaignList.settings(), newSettings);
                return newSettings;
            }
            if (!settings) return CampaignListSettingsDefault(currentPm.data?.id ?? "");
            return settings;
        },
    });
    const campaigns = useQuery({
        enabled: !!settings.data,
        queryKey: queryKeys.campaignList.displayed.withSetting(settings.data!),
        queryFn: async () => {
            if (!settings.data) return [];
            const campaigns = await dataClient.campaign.listRefByManagerIds({
                managerIds: settings.data.showManagerIds,
            });
            // console.log("Campaigns", campaigns);
            return campaigns;
        },
    });

    const sx: SxProps = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "top",
        width: "100%",
        height: "100%",
        flex: 1,
        padding: "0 1rem",
        // maxWidth: "max-content",
        "#Title": {
            padding: "20px",
        },
        "#CampaignContainer": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flex: 1,
            overflow: "auto",
            gap: "1rem",
            justifyContent: "left",
            width: "100%",
            padding: "1rem 0",
        },
    };
    // if (campaigns.isLoading) return <LoadingElement textMessage="Kampagnen werden geladen" hideLogo />;
    const dialog: { [key in DialogState]: () => React.JSX.Element } = {
        none: () => <></>,
        campaign: () => (
            <CampaignDialog
                isOpen={true}
                editing={false}
                editingData={editingData}
                onClose={() => setOpenDialog("none")}
                // parent={campaigns.data ?? []}
                // setParent={setCampaigns}
            />
        ),
    };
    // const groupedDisplay: { [key in GroupBy]: () => React.JSX.Element } = {
    //     none: () => (
    //         <Box id="CampaignContainer">
    //             {campaigns.data?.map((campaign) => {
    //                 return <CampaignElement key={campaign.id} campaignId={campaign.id} />;
    //             })}
    //         </Box>
    //     ),
    //     manager: () => <CampaignsByManager />,
    // };
    return (
        <>
            {dialog[openDialog]()}
            <Box id="CampaignList" sx={sx}>
                <Typography id="Title" variant="h3">
                    Kampagnen
                </Typography>
                <CampaignActionButtons
                    createCampaign={() => setOpenDialog("campaign")}
                    groupBy={groupBy}
                    setGroupBy={setGroupBy}
                />
                <Box id="CampaignContainer">
                    <CampaignsByManager />
                </Box>
            </Box>
        </>
    );
}
