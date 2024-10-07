import { dataClient } from "@dataClient";
import { Box, CircularProgress, Skeleton, SxProps, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Customer, NextSteps, ProjectManager, Webinar } from ".";
import { InfluencersInfo } from "./Influencers";

interface CampaignElement {
    campaignId: string;
    show?: {
        manager?: boolean;
        customer?: boolean;
        webinar?: boolean;
        id?: boolean;
        influencer?: boolean;
        nextSteps?: boolean;
    };
}
export function CampaignElement({
    campaignId,
    show: {
        manager: showManager = true,
        customer: showCustomer = true,
        id: showId = true,
        webinar: showWebinar = true,
        influencer: showInfluencer = true,
        nextSteps: showNextSteps = true,
    } = {},
}: CampaignElement) {
    const campaign = useQuery({
        queryKey: ["campaigns", campaignId],
        queryFn: async () => {
            const campaign = await dataClient.campaign.getRef(campaignId);
            return campaign;
        },
    });
    const sx: SxProps = {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyContent: "top",
        // flex: "1 1 300px",
        // maxWidth: "max-content",
        // padding: "10px",
        borderRadius: "10px",
        border: "1px solid black",
        // border: "1px solid #e0e0e0",
        // width: "100px",
        // maxWidth: "300px",
        minWidth: "200px",
        backgroundColor: "white",
        height: "100%",
        transition: "all 0.3s",
        "&:hover": {
            backgroundColor: "#f0f0f0",
            transform: "translateY(-5px)",
        },
        ".MuiSkeleton-root": {
            width: "100%",
            minWidth: "300px",
        },
        "&:has(.MuiSkeleton-root), &:has(.loading)": {
            ">#loadingIndicator": {
                display: "block",
            },
        },
        ">#loadingIndicator": {
            display: "none",
            position: "absolute",
            top: "5px",
            right: "5px",
        },
        ".categoryContainer": {
            display: "flex",
            flexDirection: "column",
            // gap: "5px",
            padding: "5px",
            // borderRadius: "5px",
            // border: "1px solid #e0e0e0",
            borderBottom: "1px solid #e0e0e0",
            borderTop: "1px solid #e0e0e0",
            "&:first-of-type": {
                borderTop: "none",
            },
            "&:last-of-type": {
                borderBottom: "none",
            },
            ".categoryTitle": {
                fontSize: "1rem",
                fontWeight: "bold",
                borderBottom: "1px dashed #e0e0e0",
            },
        },
    };
    if (campaign.isLoading)
        return (
            <Box sx={sx}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </Box>
        );
    if (!campaign.data) return null;
    return (
        <Link
            id="campaignElementLinkWrapper"
            href={`/campaign/${campaignId}`}
            passHref
        >
            <Box
                id="campaignElementContent"
                sx={sx}
            >
                <LoadingIndicator />
                {showId && <Typography>id: {campaignId}</Typography>}
                {showManager && <ProjectManager campaignId={campaignId} />}
                {showCustomer && <Customer campaignId={campaignId} />}
                {showWebinar && <Webinar campaignId={campaignId} />}
                {showInfluencer && <InfluencersInfo campaignId={campaignId} />}
                {showNextSteps && <NextSteps campaignId={campaignId} />}
            </Box>
        </Link>
    );
}

function LoadingIndicator() {
    return (
        <CircularProgress
            id="loadingIndicator"
            size="20px"
        />
    );
}
