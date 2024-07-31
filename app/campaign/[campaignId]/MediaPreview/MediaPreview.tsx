import { DataType, FilePreview, LoadingElement } from "@/app/Components";
import { dataClient } from "@/app/ServerFunctions/database";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Skeleton,
    SxProps,
    Typography,
} from "@mui/material";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListPaginateWithPathOutput, getProperties, list } from "aws-amplify/storage";
import { dayjs } from "@/app/utils";
import { Event } from "@/app/ServerFunctions/types";

interface MediaPreview {
    campaignId: string;
}
export function MediaPreview({ campaignId }: MediaPreview) {
    const queryClient = useQueryClient();
    const allFiles = useQuery({
        queryKey: ["files", campaignId],
        queryFn: async () => {
            const items = (await list({ path: `test/${campaignId}/` })).items;
            const filteredItems = await items.reduce(async (acc, item) => {
                const [eventId, dataType, fileName] = item.path.split("/").slice(-3);
                const event =
                    queryClient.getQueryData<Event>(["timelineEvent", eventId]) ??
                    (await queryClient.fetchQuery({
                        queryKey: ["timelineEvent", eventId],
                        queryFn: async () => dataClient.timelineEvent.get(eventId),
                    }));
                // console.log({ item, event });
                if (event && event.status === "WAITING_FOR_APPROVAL") {
                    return [...(await acc), item];
                }
                return acc;
            }, Promise.resolve([] as typeof items));
            console.log({ items, filteredItems });

            const grouped = await groupFilesByEvent({ files: filteredItems });
            console.log(grouped);
            return grouped;
        },
    });

    const sx: SxProps = {
        "&.MediaColumn": {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
        },
    };
    if (allFiles.isError) return <Typography>Error: {allFiles.error.message}</Typography>;
    if (allFiles.isLoading)
        return (
            <LoadingElement
                textMessage="Lade Medien für Kampagne"
                hideLogo
            />
        );
    if (allFiles.data && Object.keys(allFiles.data).length === 0) return null;
    return (
        <Box
            id="MediaColumn"
            className="MediaColumn"
            sx={sx}
        >
            <Typography textAlign={"center"}>Medien warten auf Freigabe!</Typography>
            {allFiles.data &&
                Object.entries(allFiles.data).map(([eventId, files]) => {
                    return (
                        <EventMediaDisplay
                            key={eventId}
                            eventId={eventId}
                            files={files}
                        />
                    );
                })}
            {/* {JSON.stringify(allFiles.data, null, 2)} */}
        </Box>
    );
}

interface GroupFilesByEvent {
    files: ListPaginateWithPathOutput["items"];
}
interface GroupFilesByEventOutput {
    [key: string]: { [dataKey in DataType]?: ListPaginateWithPathOutput["items"] };
}
async function groupFilesByEvent({ files }: GroupFilesByEvent): Promise<GroupFilesByEventOutput> {
    const out: GroupFilesByEventOutput = {};
    await Promise.all(
        files.map(async (file) => {
            const properties = await getProperties({ path: file.path });
            // console.log({ properties });
            const [eventId, data, fileName] = file.path.split("/").slice(-3);
            const dataKey = data as DataType;
            // console.log({ file, eventId, dataKey });
            if (!eventId || !dataKey) return;
            if (!out[eventId]) {
                out[eventId] = {};
            }
            if (!out[eventId][dataKey]) {
                out[eventId][dataKey] = [file];
            } else {
                out[eventId]?.[dataKey]?.push(file);
            }
            return;
        }),
    );
    return out;
}

interface EventMediaDisplayProps {
    eventId: string;
    files: GroupFilesByEventOutput[string];
}
function EventMediaDisplay({ eventId, files }: EventMediaDisplayProps) {
    const event = useQuery({
        queryKey: ["timelineEvent", eventId],
        queryFn: async ({ queryKey }) => {
            const [_, eventId] = queryKey;
            return dataClient.timelineEvent.get(eventId);
        },
    });
    const sx: SxProps = {
        "&.EventMediaContainer": {
            ".MuiAccordion-root": {
                border: "1px solid black",
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "#efefef",
            },
        },
    };
    if (event.isLoading || !event.data) return <Skeleton />;
    if (event.data.status !== "WAITING_FOR_APPROVAL") return null;
    return (
        <Box
            className="EventMediaContainer"
            sx={sx}
        >
            <Accordion>
                <AccordionSummary>
                    <EventDescription eventId={eventId} />
                </AccordionSummary>
                <AccordionDetails>
                    {/* <Typography variant="subtitle1">Event: {event}</Typography> */}
                    {Object.entries(files).map(([dataType, data]) => {
                        return FilePreview({
                            files: data,
                            dataType: dataType as DataType,
                            showControls: {
                                download: true,
                                approve: true,
                                replace: true,
                                delete: true,
                            },
                        });
                    })}
                    <EventMediaButtons
                        eventId={eventId}
                        campaignId={event.data.campaign.id}
                    />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

function EventDescription({ eventId }: { eventId: string }) {
    const event = useQuery({
        queryKey: ["timelineEvent", eventId],
        queryFn: async ({ queryKey }) => {
            const [_, eventId] = queryKey;
            return dataClient.timelineEvent.get(eventId);
        },
    });

    if (event.isLoading) return <Skeleton />;
    if (event.isError) return <Typography>Error: {event.error.message}</Typography>;
    if (!event.data) return null;
    const assignment = event.data.assignments[0];
    const influencerName = `${assignment.influencer?.firstName} ${assignment.influencer?.lastName}`;
    return (
        <Typography>
            <strong>{`${eventTypeDictionary[event.data.type]}`}</strong> von{" "}
            <strong>{`${influencerName}`}</strong> am{" "}
            <strong>{`${dayjs(event.data.date).format("DD.MM")}`}</strong>
        </Typography>
    );
}
const eventTypeDictionary: { [key: string]: string } = {
    Invites: "Einladungen",
    Post: "Textbeitrag",
    "Draft-Post": "Entwurf für Textbeitrag",
    Video: "Videobeitrag",
    "Draft-Video": "Aufnahme für Videobeitrag",
    ImpulsVideo: "Impulsvideo",
    "Draft-ImpulsVideo": "Aufnahme für Impulsvideo",
    WebinarSpeaker: "Auftritt als Speaker",
};

interface EventMediaButtonsProps {
    eventId: string;
    campaignId: string;
}
function EventMediaButtons({ eventId, campaignId }: EventMediaButtonsProps) {
    const queryClient = useQueryClient();
    const event = useQuery({
        queryKey: ["timelineEvent", eventId],
        queryFn: async ({ queryKey }) => {
            const [_, eventId] = queryKey;
            return dataClient.timelineEvent.get(eventId);
        },
    });

    const sx: SxProps = {
        "&.EventMediaButtons": {
            width: "100%",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            padding: "1rem",
        },
    };
    const approve = useMutation({
        mutationFn: async () => {
            const res = await dataClient.timelineEvent.update({
                id: eventId,
                updatedData: {
                    status: "APPROVED",
                },
            });
            return res;
        },
        onMutate: async () => {
            console.log("Approving...");
        },
        onSuccess: () => {
            console.log("Approved!");
            queryClient.invalidateQueries({ queryKey: ["timelineEvent", eventId] });
            queryClient.invalidateQueries({ queryKey: ["files", campaignId] });
        },
    });

    return (
        <Box
            sx={sx}
            className="EventMediaButtons"
        >
            <Button
                disabled={approve.isPending}
                variant={"contained"}
                onClick={() => approve.mutate()}
            >
                {approve.isPending ? <CircularProgress /> : "Inhalte freigeben"}
            </Button>
        </Box>
    );
}
