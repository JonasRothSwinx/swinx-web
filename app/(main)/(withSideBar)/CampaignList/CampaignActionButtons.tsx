import { Box, Button, MenuItem, SxProps, TextField } from "@mui/material";

const groupOptions = ["manager", "none"] as const;
export type GroupBy = (typeof groupOptions)[number];
interface CampaignActionButtonsProps {
    createCampaign: () => void;
    groupBy: GroupBy;
    setGroupBy: (groupBy: GroupBy) => void;
}
export function CampaignActionButtons({
    createCampaign,
    groupBy,
    setGroupBy,
}: CampaignActionButtonsProps) {
    const sx: SxProps = {
        width: "100%",
        background: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "5px",
        borderRadius: "20px",
        ".MuiInputBase-root": {
            minWidth: "150px",
        },
    };
    return (
        <Box
            sx={sx}
            id="CampaignActionButtonsContainer"
        >
            <Button onClick={createCampaign}>Neue Kampagne</Button>
            <TextField
                select
                label="Guppieren nach"
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                value={groupBy}
            >
                {groupOptions.map((option) => {
                    return (
                        <MenuItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    );
                })}
            </TextField>
        </Box>
    );
}
