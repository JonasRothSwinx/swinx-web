import database from "@/app/ServerFunctions/database/dbOperations/.database";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import {
    DialogContent,
    Menu,
    MenuItem,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ChangeEvent, ChangeEventHandler, useMemo } from "react";

interface WebinarDetailsProps {
    onChange: (data: Partial<TimelineEvent.WebinarSpeaker>) => void;
    data: Partial<TimelineEvent.WebinarSpeaker>;
    campaignId: string | undefined;
}

export default function WebinarSpeakerDetails(props: WebinarDetailsProps): JSX.Element {
    const { onChange, data, campaignId } = props;
    const queryClient = useQueryClient();

    const events = useQuery({
        enabled: !!campaignId,
        queryKey: ["events", campaignId],
        queryFn: async () => {
            if (!campaignId) return [];
            const events = await database.timelineEvent.listByCampaign(campaignId, true);
            events.map((event) => {
                queryClient.setQueryData(["event", event.id], event);
            });

            return events;
        },
    });
    const webinarEventsData = useMemo(() => {
        const webinars =
            events.data?.filter(
                (event): event is TimelineEvent.Webinar => event.type === "Webinar",
            ) ?? [];
        if (webinars.length === 0) return [];
        return webinars;
    }, [events.data]);

    const EventHandlers = {
        onWebinarSelect: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value as string;
            const selectedWebinar = webinarEventsData.find((event) => event.id === value);
            if (!selectedWebinar) return;
            onChange({ relatedEvents: { parentEvent: selectedWebinar, childEvents: [] } });
        },
        onTopicChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;
            if (!value) return;
            onChange({ eventTitle: value });
        },
    };
    if (events.isLoading) {
        return (
            <DialogContent dividers sx={{ flexBasis: "100%" }}>
                <Typography>Lade Webinare...</Typography>
            </DialogContent>
        );
    }

    if (!(webinarEventsData.length > 0)) {
        return (
            <DialogContent dividers sx={{ flexBasis: "100%" }}>
                <Typography>Keine Webinare</Typography>
            </DialogContent>
        );
    }

    return (
        <DialogContent
            dividers
            sx={{
                "& .MuiTextField-root": { marginBottom: "1rem", flexBasis: "100%" },

                flexBasis: "100%",
            }}
            about="Test"
        >
            {/* Select Webinar */}
            <TextField
                label={data.relatedEvents?.parentEvent ? "Webinar" : "Webinar auswählen"}
                select
                fullWidth
                placeholder="Webinar auswählen"
                SelectProps={{
                    placeholder: "Webinar auswählen",
                    value: data.relatedEvents?.parentEvent?.id ?? "",
                    onChange: EventHandlers.onWebinarSelect,
                }}
            >
                {webinarEventsData.map((webinar) => (
                    <MenuItem key={webinar.id} value={webinar.id}>
                        {webinar.eventTitle}
                    </MenuItem>
                ))}
            </TextField>
            {/* Thema */}
            <TextField
                label="Thema"
                value={data.eventTitle ?? ""}
                onChange={EventHandlers.onTopicChange}
            />
        </DialogContent>
    );
}
