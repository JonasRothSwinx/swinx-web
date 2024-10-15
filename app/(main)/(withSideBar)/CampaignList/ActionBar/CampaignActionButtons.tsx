import { data } from "@/amplify/data/resource";
import { queryKeys } from "@/app/(main)/queryClient/keys";
import { AddIcon } from "@/app/Definitions/Icons";
import { dataClient } from "@/app/ServerFunctions/database/dataClients";
import { Refresh } from "@mui/icons-material";
import {
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    FormControlLabel,
    IconButton,
    ListItem,
    ListItemText,
    MenuItem,
    Skeleton,
    SxProps,
    TextField,
    Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { ProjectManagers } from "@/app/ServerFunctions/types";
import { CampaignListSettings } from "../config/types";

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
export function CampaignActionButtons({ createCampaign, groupBy, setGroupBy }: CampaignActionButtonsProps) {
    const sx: SxProps = {
        width: "100%",
        background: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: "5px",
        borderRadius: "20px",
        border: "1px solid #e0e0e0",
        ".MuiInputBase-root": {
            minWidth: "150px",
        },
        ".left": {
            marginRight: "auto",
        },
    };
    return (
        <Box sx={sx} id="CampaignActionButtonsContainer">
            <CreateCampaignButton createCampaign={createCampaign} />
            {/* <ShowOwnCheckbox /> */}
            {/* <GroupBySelect groupBy={groupBy} setGroupBy={setGroupBy} /> */}
            <SelectManager />
            <ReloadButton />
        </Box>
    );
}

interface CreateCampaignButtonProps {
    createCampaign: CampaignActionButtonsProps["createCampaign"];
}
function CreateCampaignButton({ createCampaign }: CreateCampaignButtonProps) {
    const sx: SxProps = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    };
    return (
        <Box sx={sx} className="left">
            <Button onClick={createCampaign}>
                <AddIcon />
                <Typography>Neue Kampagne</Typography>
            </Button>
        </Box>
    );
}
function ShowOwnCheckbox() {
    const queryClient = useQueryClient();
    const settings = useQuery<CampaignListSettings>({
        queryKey: queryKeys.campaignList.settings(),
        // queryFn: async () => {
        //     return queryClient.getQueryData<CampaignListSettings>(queryKeys.campaignList.settings());
        // },
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
                control={<Checkbox checked={settings.data?.showOwnOnly} onChange={onChange} />}
            />
        </Box>
    );
}

function ReloadButton() {
    const queryClient = useQueryClient();
    const settings = useQuery<CampaignListSettings>({
        queryKey: queryKeys.campaignList.settings(),
    });
    const campaignsQuery = useQuery({
        enabled: !!settings.data,
        queryKey: queryKeys.campaignList.displayed.withSetting(settings.data!),
    });
    function onClick() {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaignList.displayed.all() });
    }
    const sx: SxProps = useMemo(
        () => ({
            position: "relative",
            // "& > *": {
            //     position: "absolute",
            //     margin: "auto",
            //     display: campaignsQuery.isFetching ? "block" : "none",
            // },
            ".MuiSvgIcon-root": {
                fontSize: "40px",

                animation: "spin 1s linear infinite",
                animationPlayState: campaignsQuery.isFetching ? "running" : "paused",
            },
            "@keyframes spin": {
                from: {
                    transform: "rotate(0deg)",
                },
                to: {
                    transform: "rotate(360deg)",
                },
            },
        }),
        [campaignsQuery.isFetching]
    );
    return (
        <IconButton onClick={onClick} sx={sx}>
            <Refresh />
            {/* <CircularProgress /> */}
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
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    );
                })}
            </TextField>
        </Box>
    );
}

function SelectManager() {
    const queryClient = useQueryClient();
    const managers = useQuery({
        queryKey: queryKeys.projectManager.all,
        queryFn: async () => {
            return dataClient.projectManager.list();
        },
    });
    const settings = useQuery<CampaignListSettings>({
        queryKey: queryKeys.campaignList.settings(),
        // queryFn: async () => {
        //     return queryClient.getQueryData<CampaignListSettings>(queryKeys.campaignList.settings());
        // },
    });
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.value);
        const value = e.target.value as unknown as string[];
        if (!Array.isArray(value)) {
            console.error("Value is not an array");
            return;
        }
        queryClient.setQueryData(queryKeys.campaignList.settings(), {
            ...settings.data,
            showManagerIds: value,
        });
    }
    if (!settings.data) return <Skeleton width={100} />;
    return (
        <Box>
            <TextField
                select
                label="Manager"
                // value={""}
                onChange={onChange}
                slotProps={{
                    select: {
                        multiple: true,
                        value: settings.data.showManagerIds ?? [],
                        renderValue: (selected) => {
                            if ((selected as string[]).length === 0) {
                                return null;
                            }
                            return (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    {(selected as string[]).map((value) => {
                                        const manager = managers.data?.find((manager) => manager.id === value);
                                        if (!manager) return null;
                                        return <Chip key={manager.id} label={ProjectManagers.getFullName(manager)} />;
                                    })}
                                </Box>
                            );
                        },
                    },
                }}
            >
                {managers.data?.map((manager) => {
                    return (
                        <MenuItem key={manager.id} value={manager.id}>
                            <Checkbox checked={settings.data?.showManagerIds?.includes(manager.id)} />
                            <ListItemText primary={ProjectManagers.getFullName(manager)} />
                        </MenuItem>
                    );
                }) ?? []}
            </TextField>
        </Box>
    );
}
