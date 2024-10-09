import { CloseIcon, DeleteIcon, RefreshIcon } from "@/app/Definitions/Icons";
import { dataClient } from "@dataClient";
import { Campaign } from "@/app/ServerFunctions/types";
import { Box, Button, IconButton, Skeleton, SxProps, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/(main)/queryClient/keys";
import { useMemo } from "react";

interface CampaignDetailsButtonsProps {
    campaignId: string;
}
export default function CampaignDetailsButtons({ campaignId }: CampaignDetailsButtonsProps) {
    const router = useRouter();
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: () => dataClient.campaign.getRef(campaignId),
    });
    const queryClient = useQueryClient();
    const ClickHandlers = {
        deleteCampaign: async () => {
            if (!campaignId || !confirm("Kampagne wirklich unwiderruflich löschen?")) return;
            if (!campaign.data) {
                alert("Kampagne nicht gefunden");
                return;
            }
            router.prefetch("/");
            await dataClient.campaign.deleteRef({
                campaignId: campaignId,
                customerIds: campaign.data.customerIds,
                eventIds: campaign.data.events.map((event) => event.id),
            });
            router.push("/");
        },
    };
    return (
        <Box id="CampaignDetailsButtons">
            {campaignId ? (
                <Button
                    id="DeleteButton"
                    variant="outlined"
                    color="inherit"
                    onClick={() => ClickHandlers.deleteCampaign()}
                >
                    <DeleteIcon color="error" />
                    <Typography
                        color="error"
                        variant="body1"
                    >
                        Löschen
                    </Typography>
                </Button>
            ) : (
                <Skeleton />
            )}
            <RefreshCampaignButton campaignId={campaignId} />
            <Link
                href="/"
                prefetch
            >
                <IconButton>
                    <CloseIcon />
                </IconButton>
            </Link>
        </Box>
    );
}

interface RefreshCampaignButtonProps {
    campaignId: string;
}
function RefreshCampaignButton({ campaignId }: RefreshCampaignButtonProps) {
    const queryClient = useQueryClient();
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: () => dataClient.campaign.getRef(campaignId),
    });
    function refreshCampaign() {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.one(campaignId) });
    }
    const sx = useMemo<SxProps>(
        () => ({
            animationPlayState: "running",
            animationName: "spin",
            animationDuration: "500ms",
            animationIterationCount: `${campaign.isFetching ? "infinite" : "0"}`,
            animationTimingFunction: "linear",
            "@keyframes spin": {
                "100%": { transform: `rotate(360deg)` },
            },
        }),
        [campaign.isFetching],
    );
    return (
        <IconButton
            onClick={refreshCampaign}
            sx={sx}
        >
            <RefreshIcon />
        </IconButton>
    );
}
