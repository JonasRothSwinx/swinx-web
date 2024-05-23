import { Nullable } from "@/app/Definitions/types";
import { Box } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TimelineEvent } from "../Functions/Database/types";
import sortEvents, { SortedEvents } from "../Functions/sortEvents";
import Loading from "./Loading";
import {
    InvitesDescription,
    PostDescription,
    VideoDescription,
    WebinarSpeakerDescription,
} from "./AsssignmentDescriptions";
import { dataClient } from "../Functions/Database";

//MARK: - AssignmentDescription
type EventTypeDescription = {
    [key: string]: (props: { events: TimelineEvent[] }) => Nullable<JSX.Element>;
};
const eventTypeDescription: EventTypeDescription = {
    Webinar: (props) => null,
    Invites: (props) => <InvitesDescription {...props} />,
    WebinarSpeaker: (props) => <WebinarSpeakerDescription {...props} />,
    Post: (props) => <PostDescription {...props} />,
    Video: (props) => <VideoDescription {...props} />,
};
interface AssignmentDescriptionProps {
    assignmentId: string;
}
export function AssignmentDescription({ assignmentId }: AssignmentDescriptionProps) {
    // const queryClient = useQueryClient();
    const events = useQuery({
        enabled: !!assignmentId,
        queryKey: ["events"],
        queryFn: async () => {
            const events = await dataClient.getEventsByAssignment({ id: assignmentId });
            return events;
        },
    });

    const sortedEvents = useQuery({
        enabled: !!events.data,
        queryKey: ["sortedEvents"],
        queryFn: () => {
            if (!events.data) return {};
            return sortEvents({ events: events.data });
        },
    });
    const descriptionOrder = ["Invites", "Post", "Video", "WebinarSpeaker"];
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
