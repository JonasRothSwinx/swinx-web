import { queryKeys } from "@/app/(main)/queryClient/keys";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    MenuItem,
    SxProps,
    TextField,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const groupOptions = ["manager", "none"] as const;
export type GroupBy = (typeof groupOptions)[number];
const groupByLabels: { [key in GroupBy]: string } = {
    manager: "Manager",
    none: "Keine",
};
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
        border: "1px solid #e0e0e0",
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
            <ShowOwnCheckbox />
            <ReloadButton />
            <GroupBySelect
                groupBy={groupBy}
                setGroupBy={setGroupBy}
            />
        </Box>
    );
}

function ShowOwnCheckbox() {
    const queryClient = useQueryClient();
    const settings = useQuery({
        queryKey: queryKeys.campaignList.settings(),
        queryFn: async () => {
            return (
                queryClient.getQueryData<{ showOwnOnly?: boolean }>(
                    queryKeys.campaignList.settings(),
                ) ?? { showOwnOnly: false }
            );
        },
    });
    async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        await queryClient.setQueryData(queryKeys.campaignList.settings(), {
            ...settings.data,
            showOwnOnly: e.target.checked,
        });
        // queryClient.invalidateQueries({ queryKey: queryKeys.campaign.all });
    }
    if (!settings.data) return null;
    const sx: SxProps = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    };
    return (
        <Box sx={sx}>
            <FormControlLabel
                label="Nur eigene"
                control={
                    <Checkbox
                        checked={settings.data?.showOwnOnly}
                        onChange={onChange}
                    />
                }
            />
        </Box>
    );
}

function ReloadButton() {
    const queryClient = useQueryClient();
    const campaignsQuery = useQuery({ queryKey: queryKeys.campaign.all });
    function onClick() {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.all });
    }
    const sx: SxProps = useMemo(
        () => ({
            position: "relative",
            "& > *": {
                position: "absolute",
                margin: "auto",
                display: campaignsQuery.isFetching ? "block" : "none",
            },
        }),
        [campaignsQuery.isFetching],
    );
    return (
        <IconButton
            onClick={onClick}
            sx={sx}
        >
            Reload
            <CircularProgress />
        </IconButton>
    );
}

interface GroupBySelectProps {
    groupBy: CampaignActionButtonsProps["groupBy"];
    setGroupBy: CampaignActionButtonsProps["setGroupBy"];
}
function GroupBySelect({ groupBy, setGroupBy }: GroupBySelectProps) {
    const sx: SxProps = {
        padding: "10px 5px",
        ".MuiSelect-select": {
            padding: "5px 10px",
        },
    };
    return (
        <Box sx={sx}>
            <TextField
                select
                label="Guppieren nach"
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                value={groupBy}
            >
                {Object.entries(groupByLabels).map(([value, label]) => {
                    return (
                        <MenuItem
                            key={value}
                            value={value}
                        >
                            {label}
                        </MenuItem>
                    );
                })}
            </TextField>
        </Box>
    );
}
