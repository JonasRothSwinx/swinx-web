import { Nullable } from "@/app/Definitions/types";
import { Box } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TimelineEvent } from "../Functions/Database/types";
import sortEvents, { SortedEvents } from "../Functions/sortEvents";
import Loading from "./Loading";
import Descriptions from "./AsssignmentDescriptions";
import { dataClient } from "../Functions/Database";
import React from "react";
import { queryKeys } from "../queryKeys";
import { queryClient } from "@/app/Components/StorageManagers/functions";

//MARK: - AssignmentDescription
type EventTypeDescription = {
    [key: string]: (props: {
        events: TimelineEvent[];
        parentEventId: string;
    }) => Nullable<React.JSX.Element>;
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
    parentEventId: string;
}
export function AssignmentDescription({ assignmentId, parentEventId }: AssignmentDescriptionProps) {
    const queryClient = useQueryClient();
    const events = useQuery({
        enabled: !!assignmentId,
        queryKey: queryKeys.assignment.events.all(assignmentId),
        queryFn: async () => {
            const events = await dataClient.getEventsByAssignment({ id: assignmentId });
            return events;
        },
    });

    const sortedEvents = useQuery({
        enabled: !!events.data,
        queryKey: queryKeys.assignment.events.sorted(assignmentId),
        queryFn: () => {
            const data = queryClient.getQueryData<TimelineEvent[]>(
                queryKeys.assignment.events.all(assignmentId),
            );
            if (!data) return null;
            return sortEvents({ events: data });
        },
    });
    const descriptionOrder = ["Invites", "Post", "Video", "ImpulsVideo", "WebinarSpeaker"];
    if (sortedEvents.isLoading) return <Loading />;
    if (sortedEvents.isError) return <Box>Error</Box>;
    if (sortedEvents.data === null || !sortedEvents.data) return <Box>No data</Box>;
    return (
        <Box id="AssignmentDescriptionsContainer">
            {descriptionOrder.map((type) => {
                if (sortedEvents.data === null) return null;
                return sortedEvents.data[type as keyof SortedEvents] ? (
                    <Box
                        key={type}
                        id="AssignmentDescriptionGroup"
                    >
                        {/* <Typography variant="h5">{type}</Typography> */}
                        {eventTypeDescription[type as keyof EventTypeDescription]?.({
                            events: sortedEvents.data[type as keyof SortedEvents],
                            parentEventId,
                        }) ?? null}
                    </Box>
                ) : null;
            })}
        </Box>
    );
}
