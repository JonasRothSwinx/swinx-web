import { PartialWith } from "@/app/Definitions/types";
import { TextFieldWithTooltip } from "@/app/Components/Dialogs/Components";
import { dataClient } from "@/app/ServerFunctions/database";
import { Event, Events } from "@/app/ServerFunctions/types";
import { SelectChangeEvent, Typography, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DateSelectorProps } from "../DateSelector";
import { isFixedDate } from "../config";

//MARK: ParentEventSelector
interface ParentEventSelectorProps {
    parentEventType: { parentEventType: Events.multiEventType } | false;
    timelineEvent: PartialWith<Event, "parentEvent" | "campaign">;
    setTimelineEvent: DateSelectorProps["setTimelineEvent"];
    setUpdatedData: DateSelectorProps["setUpdatedData"];
}
export function ParentEventSelector({
    timelineEvent,
    setTimelineEvent,
    setUpdatedData,
    parentEventType,
}: ParentEventSelectorProps) {
    const { id: campaignId } = timelineEvent.campaign;
    const { type: eventType } = timelineEvent;

    const grandParentEventType = parentEventType ? parentEventType.parentEventType : null;

    //########################################
    //#region Queries
    const events = useQuery({
        queryKey: ["events"],
        queryFn: async () => {
            const events = await dataClient.timelineEvent.byCampaign(campaignId);
            return events;
        },
    });

    const parentEventChoices = useMemo(() => {
        return events.data?.filter((event) => grandParentEventType && event.type === grandParentEventType) ?? [];
    }, [events.data, grandParentEventType]);
    //#endregion
    //########################################

    const EntryName: { [key in Events.multiEventType]: (id: string) => string } = {
        Webinar: (id) => {
            const event = parentEventChoices.find((x) => x.id === id);
            return event?.eventTitle ?? "Webinar";
        },
    };

    const NoParentsText: { [key in Events.multiEventType]: string } = {
        Webinar: "Keine Webinare gefunden",
    };

    const Handler = {
        onParentEventChange: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            const selectedEvent = parentEventChoices.find((event) => event.id === value);
            if (!selectedEvent) {
                console.log(`Event not found: ${value}`);
                console.log({ parentEventChoices });
                return;
            }
            console.log("selectedEvent", selectedEvent);
            setTimelineEvent((prev) => ({
                ...prev,
                parentEvent: selectedEvent,
            }));
            //If event type has a fixed date, set the date to the parent event date
            if (eventType && isFixedDate[eventType]) {
                setUpdatedData((prev) => {
                    const newValue = prev.map((event) => ({ ...event, date: selectedEvent.date }));
                    return newValue;
                });
            }
        },
    };

    if (!grandParentEventType) return null;
    if (!parentEventChoices || parentEventChoices.length < 1)
        return (
            <Typography
                sx={{
                    width: "100%",
                    backgroundColor: "red",
                    textAlign: "center",
                }}
            >
                {NoParentsText[grandParentEventType]}
            </Typography>
        );

    return (
        <TextFieldWithTooltip
            name="parentEvent"
            select
            required
            label="Hauptereignis"
            SelectProps={{
                onChange: Handler.onParentEventChange,
                value: timelineEvent.parentEvent?.id ?? "",
            }}
            tooltipProps={{
                title: "Zu welchem Hauptereignis gehört dieses Ereignis?",
            }}
        >
            {parentEventChoices.map((parentEvent) => {
                if (!parentEvent.id) return null;
                return (
                    <MenuItem key={parentEvent.id} value={parentEvent.id}>
                        {EntryName[grandParentEventType](parentEvent.id)}
                    </MenuItem>
                );
            })}
        </TextFieldWithTooltip>
    );
}
