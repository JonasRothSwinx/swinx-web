import Assignment from "@/app/ServerFunctions/types/assignment";
import { Typography } from "@mui/material";

export function InfluencerName(props: { assignedInfluencer: Assignment.Assignment }) {
    const { assignedInfluencer } = props;
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "left",
                width: "100%",
                maxHeight: "1em",
            }}
        >
            {assignedInfluencer.isPlaceholder ? (
                <Typography>{`Influencer ${assignedInfluencer.placeholderName}`}</Typography>
            ) : (
                <Typography>{`${assignedInfluencer.influencer?.firstName} ${assignedInfluencer.influencer?.lastName}`}</Typography>
            )}
        </div>
    );
}
