import { Nullable } from "@/app/Definitions/types";
import { Box } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TimelineEvent } from "../Functions/Database/types";
import sortEvents, { SortedEvents } from "../Functions/sortEvents";
import Loading from "./Loading";
import Descriptions from "./AsssignmentDescriptions";
import { dataClient } from "../Functions/Database";
import React from "react";

//MARK: - AssignmentDescription
type EventTypeDescription = {
    [key: string]: (props: { events: TimelineEvent[] }) => Nullable<React.JSX.Element>;
};
const eventTypeDescription: EventTypeDescription = {
    Webinar: (props) => null,
    ImpulsVideo: (props) => <Descriptions.ImpulsVideo {...props} />,
    Invites: (props) => <Descriptions.Invites {...props} />,
    WebinarSpeaker: (props) => <Descriptions.WebinarSpeaker {...props} />,
    Post: (props) => <Descriptions.Post {...props} />,
    Video: (props) => <Descriptions.Video {...props} />,
};
interface AssignmentDescriptionProps {
    assignmentId: string;
}
export function AssignmentDescription({ assignmentId }: AssignmentDescriptionProps) {
    // const queryClient = useQueryClient();
    const events = useQuery({
        enabled: !!assignmentId,
        queryKey: [assignmentId, "events"],
        queryFn: async () => {
            const events = await dataClient.getEventsByAssignment({ id: assignmentId });
            return events;
        },
    });

    const sortedEvents = useQuery({
        enabled: !!events.data,
        queryKey: [{ events: events.data }, "sortedEvents"],
        queryFn: () => {
            if (!events.data) return {};
            return sortEvents({ events: events.data });
        },
    });
    const descriptionOrder = ["Invites", "Post", "Video", "ImpulsVideo", "WebinarSpeaker"];
    if (sortedEvents.isLoading) return <Loading />;
    if (sortedEvents.isError) return <Box>Error</Box>;
    if (!sortedEvents.data) return <Box>No data</Box>;
    return (
        <Box id="AssignmentDescriptionsContainer">
            {descriptionOrder.map((type) => {
                return sortedEvents.data[type as keyof SortedEvents] ? (
                    <Box key={type} id="AssignmentDescriptionGroup">
                        {/* <Typography variant="h5">{type}</Typography> */}
                        {eventTypeDescription[type as keyof EventTypeDescription]?.({
                            events: sortedEvents.data[type as keyof SortedEvents],
                        }) ?? null}
                    </Box>
                ) : null;
            })}
        </Box>
    );
}
