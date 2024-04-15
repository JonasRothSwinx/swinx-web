import { CloseIcon, DeleteIcon, RefreshIcon } from "@/app/Definitions/Icons";
import { campaigns as campaigns } from "@/app/ServerFunctions/database/dbOperations";
import Campaign from "@/app/ServerFunctions/types/campaign";
import { Button, IconButton, Skeleton, Typography } from "@mui/material";

interface CampaignDetailsButtonsProps {
    updateCampaign: (background?: boolean) => void;
    handleClose: (hasChanged?: boolean) => void;
    campaign?: Campaign.Campaign;
    isLoading?: boolean;
}
export default function CampaignDetailsButtons(props: CampaignDetailsButtonsProps) {
    const { updateCampaign, handleClose, campaign, isLoading } = props;
    const ClickHandlers = {
        deleteCampaign: () => {
            return () => {
                if (!campaign || !confirm("Kampagne wirklich unwiderruflich löschen?")) return;
                campaigns.delete(campaign);
                handleClose(true);
            };
        },
    };
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "right",
                position: "relative",
            }}
        >
            {campaign ? (
                <Button
                    style={{ position: "absolute", left: "0" }}
                    variant="outlined"
                    color="inherit"
                    onClick={ClickHandlers.deleteCampaign()}
                >
                    <DeleteIcon color="error" />
                    <Typography color="error" variant="body1">
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
            <IconButton onClick={() => handleClose()}>
                <CloseIcon />
            </IconButton>
        </div>
    );
}
