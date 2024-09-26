import { LoadingElement } from "@/app/Components";
import { dataClient } from "@/app/ServerFunctions/database";
import { ProjectManagers } from "@/app/ServerFunctions/types";
import { Box, SxProps, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CampaignElement } from "./CampaignElement";

export function CampaignsByManager() {
    const campaigns = useQuery({
        queryKey: ["campaign"],
        queryFn: async () => {
            const campaigns = await dataClient.campaign.list();
            return campaigns;
        },
    });
    const managers = useQuery({
        queryKey: ["projectManager"],
        queryFn: async () => {
            const managers = await dataClient.projectManager.list();
            return managers;
        },
    });
    const groupedCampaigns = useMemo(() => {
        if (campaigns.data === undefined || managers.data === undefined) return [];
        console.log(managers.data);
        return managers.data.map((manager) => {
            return {
                manager,
                campaigns: campaigns.data.filter((campaign) =>
                    campaign.projectManagers.some((x) => x.id === manager.id),
                ),
            };
        });
    }, [campaigns.data, managers.data]);

    const sx: SxProps = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1,
        maxWidth: "max-content",
        justifyContent: "left",
        "#managerCampaignGroup": {
            display: "flex",
            flexDirection: "column",
            flexGrow: 0,
            gap: "10px",
            alignItems: "flex-start",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            border: "1px solid #e0e0e0",
            width: "max-content",
            padding: "10px",
            "#campaignContainer": {
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                // padding: "10px",
            },
        },
    };
    if (campaigns.isLoading || managers.isLoading) return <LoadingElement />;
    return (
        <Box
            id="groupedCampaignContainer"
            sx={sx}
        >
            {groupedCampaigns.map(({ manager, campaigns }) => {
                if (campaigns.length === 0) return null;
                return (
                    <Box
                        id="managerCampaignGroup"
                        key={manager.id}
                    >
                        <Typography>{ProjectManagers.getFullName(manager)}</Typography>
                        <Box id="campaignContainer">
                            {campaigns.map((campaign) => (
                                <CampaignElement
                                    key={campaign.id}
                                    campaignId={campaign.id}
                                    show={{ manager: false, id: false }}
                                />
                            ))}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
