import { CampaignDialog } from "@/app/Components";
import { LoadingElement } from "@/app/Components/Loading";
import { dataClient } from "@dataClient";
import { Campaign } from "@/app/ServerFunctions/types";
import { Box, SxProps, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CampaignActionButtons, GroupBy } from "./ActionBar";
import { CampaignElement, CampaignsByManager } from "./components";
import { queryKeys } from "../../queryClient/keys";

type DialogState = "none" | "customer" | "campaign" | "webinar" | "timelineEvent";

export function CampaignList2() {
    const [openDialog, setOpenDialog] = useState<DialogState>("none");
    const [groupBy, setGroupBy] = useState<GroupBy>("manager");
    const [editingData, setEditingData] = useState<Campaign>();
    const queryClient = useQueryClient();

    const campaigns = useQuery({
        queryKey: queryKeys.campaign.all,
        queryFn: async () => {
            const campaigns = await dataClient.campaign.listRef();
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
    if (campaigns.isLoading)
        return (
            <LoadingElement
                textMessage="Kampagnen werden geladen"
                hideLogo
            />
        );
    const dialog: { [key in DialogState]: () => JSX.Element } = {
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
        customer: () => <></>,
        webinar: () => <></>,
        timelineEvent: () => <></>,
    };
    const groupedDisplay: { [key in GroupBy]: () => JSX.Element } = {
        none: () => (
            <Box id="CampaignContainer">
                {campaigns.data?.map((campaign) => {
                    return (
                        <CampaignElement
                            key={campaign.id}
                            campaignId={campaign.id}
                        />
                    );
                })}
            </Box>
        ),
        manager: () => <CampaignsByManager />,
    };
    return (
        <>
            {dialog[openDialog]()}
            <Box
                id="CampaignList"
                sx={sx}
            >
                <Typography
                    id="Title"
                    variant="h3"
                >
                    Kampagnen
                </Typography>
                <CampaignActionButtons
                    createCampaign={() => setOpenDialog("campaign")}
                    groupBy={groupBy}
                    setGroupBy={setGroupBy}
                />
                {campaigns.data && campaigns.data?.length > 0 ? (
                    <Box id="CampaignContainer">{groupedDisplay[groupBy]()}</Box>
                ) : (
                    <Typography margin={"auto"}>Keine Kampagnen gefunden</Typography>
                )}
            </Box>
        </>
    );
}
