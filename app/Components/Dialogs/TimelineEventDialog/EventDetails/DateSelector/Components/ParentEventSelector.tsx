import { PartialWith } from "@/app/Definitions/types";
import { TextFieldWithTooltip } from "@/app/Components/Dialogs/Components";
import { dataClient } from "@/app/ServerFunctions/database";
import { Event, Events } from "@/app/ServerFunctions/types";
import { SelectChangeEvent, Typography, MenuItem, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DateSelectorProps } from "../DateSelector";
import { isFixedDate } from "../config";

//MARK: ParentEventSelector
interface ParentEventSelectorProps {
    parentEventType: Events.multiEventType | false;
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

    const grandParentEventType = parentEventType ? parentEventType : null;

    //########################################
    //#region Queries
    const parentEventChoices = useQuery({
        queryKey: ["events", parentEventType],
        queryFn: async () => {
            const events = await dataClient.timelineEvent.byCampaign(campaignId);
            const parentEventChoices = events.filter((event) => parentEventType && event.type === parentEventType);
            console.log("events", { events, parentEventChoices });
            return parentEventChoices;
        },
    });

    // const parentEventChoices = useMemo(() => {
    //     return (
    //         parentEventChoices.data?.filter(
    //             (event) => grandParentEventType && event.type === grandParentEventType,
    //         ) ?? []
    //     );
    // }, [parentEventChoices.data, grandParentEventType]);
    //#endregion
    //########################################

    const EntryName: { [key in Events.multiEventType]: (id: string) => string } = {
        Webinar: (id) => {
            const event = parentEventChoices.data?.find((x) => x.id === id);
            return event?.eventTitle ?? "Webinar";
        },
    };

    const NoParentsText: { [key in Events.multiEventType]: string } = {
        Webinar: "Keine Webinare gefunden",
    };

    const Handler = {
        onParentEventChange: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            const selectedEvent = parentEventChoices.data?.find((event) => event.id === value);
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
    if (parentEventChoices.isLoading) return <CircularProgress />;
    // if (!parentEventChoices || parentEventChoices.length < 1)
    if (!parentEventChoices.data || parentEventChoices.data.length < 1)
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
            {parentEventChoices.data.map((parentEvent) => {
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
