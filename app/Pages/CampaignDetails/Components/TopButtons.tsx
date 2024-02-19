import { CloseIcon, DeleteIcon, RefreshIcon } from "@/app/Definitions/Icons";
import { Campaign } from "@/app/ServerFunctions/databaseTypes";
import { deleteCampaign } from "@/app/ServerFunctions/serverActions";
import { Button, IconButton, Skeleton, Typography } from "@mui/material";

interface CampaignDetailsButtonsProps {
    updateCampaign: () => void;
    handleClose: (hasChanged?: boolean) => void;
    campaign?: Campaign.Campaign;
}
export default function CampaignDetailsButtons(props: CampaignDetailsButtonsProps) {
    const { updateCampaign, handleClose, campaign } = props;
    const ClickHandlers = {
        deleteCampaign: () => {
            return () => {
                if (!campaign || !confirm("Kampagne wirklich unwiderruflich löschen?")) return;
                deleteCampaign(campaign);
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
            <IconButton onClick={() => updateCampaign()}>
                <RefreshIcon />
            </IconButton>
            <IconButton onClick={() => handleClose()}>
                <CloseIcon />
            </IconButton>
        </div>
    );
}
