import { LoadingElement } from "@/app/Components/Loading";
import { dataClient } from "@dataClient";
import { ProjectManagers } from "@/app/ServerFunctions/types";
import { Box, SxProps, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { CampaignElement } from "./CampaignElement/_CampaignElement";
import { queryKeys } from "@/app/(main)/queryClient/keys";
import { getUserAttributes, getUserGroups } from "@/app/ServerFunctions/serverActions";
import { CampaignListSettings } from "../config/types";

export function CampaignsByManager() {
    const queryClient = useQueryClient();
    const settings = useQuery<CampaignListSettings>({
        queryKey: queryKeys.campaignList.settings(),
        // queryFn: async () => {
        //     return queryClient.getQueryData<CampaignListSettings>(queryKeys.campaignList.settings());
        // },
    });
    const currentManager = useQuery({
        queryKey: queryKeys.currentUser.projectManager(),
        queryFn: async () => {
            const attributes = await getUserAttributes();
            if (attributes.sub === undefined) return null;
            const manager = await dataClient.projectManager.getByCognitoId({
                cognitoId: attributes.sub,
            });
            return manager;
        },
    });
    const campaigns = useQuery({
        enabled: !!currentManager.data && !!settings.data,

        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: queryKeys.campaignList.displayed.withSetting(settings.data!),
        queryFn: async () => {
            console.log("Fetching campaigns", settings.data);
            // if (settings.data?.showOwnOnly) {
            //     if (!currentManager.data) return [];
            //     const campaigns = await dataClient.campaign.listRef({
            //         filters: { managerIds: [currentManager.data.id] },
            //     });
            //     return campaigns;
            // }
            const campaigns = await dataClient.campaign.listRef({
                filters: { managerIds: settings.data?.showManagerIds },
            });
            return campaigns;
        },
    });
    const managers = useQuery({
        queryKey: queryKeys.projectManager.all,
        queryFn: async () => {
            const managers = await dataClient.projectManager.list();
            return managers;
        },
    });
    const userGroups = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
        queryFn: async () => {
            const userGroups = await getUserGroups();
            return userGroups;
        },
    });
    const groupedCampaigns = useMemo(() => {
        if (campaigns.data === undefined || managers.data === undefined) return [];
        const filteredCampaigns = campaigns.data.filter((campaign) => {
            if (settings.data?.showOwnOnly) {
                return campaign.projectManagerIds.some((x) => x === currentManager.data?.id);
            }
            return true;
        });
        // console.log(managers.data);
        return managers.data.map((manager) => {
            return {
                manager,
                campaigns: filteredCampaigns.filter((campaign) =>
                    campaign.projectManagerIds.some((x) => x === manager.id)
                ),
            };
        });
    }, [campaigns.data, managers.data, settings.data, currentManager.data?.id]);

    const sx: SxProps = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1,
        width: "auto",
        // maxWidth: "max-content",
        justifyContent: "left",
        "#managerCampaignGroup": {
            display: "flex",
            flexDirection: "column",
            flexGrow: 0,
            gap: "10px",
            alignItems: "flex-start",
            // backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            // border: "1px solid #e0e0e0",
            width: "auto",
            maxWidth: "100%",
            padding: "10px",
            ".managerName": {
                backgroundColor: "#f0f0f0",
                fontSize: "1.5rem",
                fontWeight: "bold",
                padding: "2px 50px",
                borderRadius: "5px",
                border: "1px solid #e0e0e0",
                marginInline: "auto",
            },
            "#campaignContainer": {
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                // justifyContent: "center",
                gap: "10px",
                width: "100%",
                "&>#campaignElementLinkWrapper": {
                    flex: "1",
                    maxWidth: "max-content",
                },
                // padding: "10px",
            },
        },
    };
    if (campaigns.isLoading || managers.isLoading) return <LoadingElement hideLogo />;
    return (
        <Box id="groupedCampaignContainer" sx={sx}>
            {groupedCampaigns.map(({ manager, campaigns }) => {
                if (campaigns.length === 0) return null;
                return (
                    <Box id="managerCampaignGroup" key={manager.id}>
                        <Typography className="managerName">{ProjectManagers.getFullName(manager)}</Typography>
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
