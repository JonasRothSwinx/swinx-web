import { Box, ListSubheader, MenuItem, SxProps, TextField } from "@mui/material";
import { industries } from "./data";
import React, { useMemo } from "react";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
interface filterProps {
    targetAudience: TimelineEvent.Event["targetAudience"];
    onChange: (newData: Partial<TimelineEvent.Event["targetAudience"]>) => void;
}

export default function Filter(props: filterProps) {
    const { targetAudience, onChange } = props;
    const sxProps: SxProps = useMemo(
        () =>
            ({
                "&": {
                    "&": {
                        maxWidth: "100%",
                        width: "100%",
                        // maxHeight: "5em",
                        // overflowY: "auto",
                    },
                    ".MuiTextField-root": {
                        width: "100%",
                    },
                    ".MuiSelect-select": {
                        whiteSpace: "pre-wrap",
                        maxHeight: "5em",
                        overflowY: "auto",
                        maxLines: 5,
                        borderRadius: 0,
                    },
                    "#IndustryFilter": {
                        width: "100%",
                    },
                    "& #GroupHeader": {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "red",
                        backgroundColor: "blue",
                    },
                },
            } satisfies SxProps),
        []
    );
    const Changehandler = {
        targetAudienceChange: (newData: string[]) => {
            onChange({
                industry: newData,
            });
        },
    };
    return (
        <Box id="AudienceFilterWrapper" sx={sxProps}>
            <TextField
                id="IndustryFilter"
                label="Zielgruppen"
                select
                multiline
                SelectProps={{
                    sx: sxProps,
                    multiple: true,
                    value: targetAudience?.industry ?? [],
                    onChange: (e) => {
                        const newData = e.target.value as string[];
                        Changehandler.targetAudienceChange(newData);
                    },
                }}
            >
                {Object.entries(industries).map(([category, items]) => {
                    return [
                        <ListSubheader id="GroupHeader" key={category}>
                            {category}
                        </ListSubheader>,
                        ...items.map((item) => (
                            <MenuItem id="FilterItem" key={`${category}>${item}`} value={item}>
                                {item}
                            </MenuItem>
                        )),
                    ];
                })}
            </TextField>
        </Box>
    );
}
