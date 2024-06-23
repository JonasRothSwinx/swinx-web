import { Box, ListSubheader, MenuItem, SxProps, TextField } from "@mui/material";
import { industries, countries } from "./data";
import React, { useMemo } from "react";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
interface filterProps {
    event: Partial<TimelineEvent.Event>;
    updatedData: Partial<TimelineEvent.Event>[];
    onChange: (newData: Partial<TimelineEvent.Event>[]) => void;
}

export default function Filter({
    event,
    event: {
        targetAudience = {
            industry: [],
            cities: [],
            country: [],
        },
    },
    onChange,
    updatedData,
}: filterProps) {
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
                    // ".MuiSelect-select": {
                    //     whiteSpace: "pre-wrap",
                    //     maxHeight: "5em",
                    //     overflowY: "auto",
                    //     maxLines: 5,
                    //     borderRadius: 0,
                    // },
                    "#IndustryFilter": {
                        width: "100%",
                        whiteSpace: "pre-wrap",
                        maxHeight: "5em",
                        overflowY: "auto",
                        maxLines: 5,
                        borderRadius: 0,
                    },
                    "& #GroupHeader": {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "red",
                        backgroundColor: "blue",
                    },
                },
            } satisfies SxProps),
        [],
    );
    const Changehandler = {
        targetIndustryChange: (newData: string[]) => {
            const newEvents = updatedData.map((event) => {
                return {
                    ...event,
                    targetAudience: { ...targetAudience, industry: newData },
                };
            });

            onChange(newEvents);
        },
        targetCountryChange: (newData: string[]) => {
            const newEvents = updatedData.map((event) => {
                return {
                    ...event,
                    targetAudience: { ...targetAudience, country: newData },
                };
            });
            onChange(newEvents);
        },
    };
    return (
        <Box
            id="AudienceFilterWrapper"
            sx={sxProps}
        >
            <IndustryFilter
                industryTargets={targetAudience.industry}
                onChange={Changehandler.targetIndustryChange}
            />
            <CountryFilter
                countryTargets={targetAudience.country}
                onChange={Changehandler.targetCountryChange}
            />
        </Box>
    );
}
interface IndustryFilterProps {
    onChange: (newData: string[]) => void;
    industryTargets: string[];
}

function IndustryFilter(props: IndustryFilterProps) {
    const { onChange, industryTargets } = props;
    return (
        <TextField
            id="IndustryFilter"
            label="Zielgruppen"
            select
            multiline
            SelectProps={{
                multiple: true,
                value: industryTargets,
                onChange: (e) => {
                    const newData = e.target.value as string[];
                    onChange(newData);
                },
            }}
            variant="standard"
        >
            {Object.entries(industries).map(([category, items]) => {
                return [
                    <ListSubheader
                        id="GroupHeader"
                        key={category}
                    >
                        {category}
                    </ListSubheader>,
                    ...items.map((item) => (
                        <MenuItem
                            id="FilterItem"
                            key={`${category}>${item}`}
                            value={item}
                        >
                            {item}
                        </MenuItem>
                    )),
                ];
            })}
        </TextField>
    );
}

interface CountryFilterProps {
    onChange: (newData: string[]) => void;
    countryTargets: string[];
}
function CountryFilter(props: CountryFilterProps) {
    const { onChange, countryTargets } = props;
    return (
        <TextField
            id="CountryFilter"
            label="Zielländer"
            select
            multiline
            SelectProps={{
                multiple: true,
                value: countryTargets,
                onChange: (e) => {
                    const newData = e.target.value as string[];
                    onChange(newData);
                },
            }}
            variant="standard"
        >
            {countries.map((country) => {
                return (
                    <MenuItem
                        id="FilterItem"
                        key={country}
                        value={country}
                    >
                        {country}
                    </MenuItem>
                );
            })}
        </TextField>
    );
}
