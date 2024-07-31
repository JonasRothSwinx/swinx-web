import { CloseIcon, DeleteIcon, RefreshIcon } from "@/app/Definitions/Icons";
import { dataClient } from "@/app/ServerFunctions/database";
import { Campaign } from "@/app/ServerFunctions/types";
import { Box, Button, IconButton, Skeleton, Typography } from "@mui/material";
import Link from "next/link";

interface CampaignDetailsButtonsProps {
    updateCampaign: (background?: boolean) => void;
    handleClose: (hasChanged?: boolean) => void;
    campaign?: Campaign;
    isLoading?: boolean;
}
export default function CampaignDetailsButtons(props: CampaignDetailsButtonsProps) {
    const { updateCampaign, handleClose, campaign, isLoading } = props;
    const ClickHandlers = {
        deleteCampaign: () => {
            return () => {
                if (!campaign || !confirm("Kampagne wirklich unwiderruflich löschen?")) return;
                dataClient.campaign.delete(campaign);
                handleClose(true);
            };
        },
    };
    return (
        <Box id="CampaignDetailsButtons">
            {campaign ? (
                <Button
                    id="DeleteButton"
                    variant="outlined"
                    color="inherit"
                    onClick={ClickHandlers.deleteCampaign()}
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
            <IconButton
                onClick={() => updateCampaign(true)}
                sx={{
                    animationPlayState: "running",
                    animationName: "spin",
                    animationDuration: "500ms",
                    animationIterationCount: `${isLoading ? "infinite" : "0"}`,
                    animationTimingFunction: "linear",
                    "@keyframes spin": {
                        "100%": { transform: `rotate(360deg)` },
                    },
                }}
            >
                <RefreshIcon />
            </IconButton>
            <Link href="/">
                <IconButton>
                    <CloseIcon />
                </IconButton>
            </Link>
        </Box>
    );
}
