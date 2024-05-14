import {
    Box,
    Button,
    CircularProgress,
    Unstable_Grid2 as Grid,
    List,
    SxProps,
    Table,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { dataClient } from "../Functions/Database";
import dayjs from "@/app/utils/configuredDayJs";
import { Assignment, Campaign, TimelineEvent, Webinar } from "../Functions/Database/types";
import sortEvents, { SortedEvents } from "../Functions/sortEvents";
import { Nullable } from "@/app/Definitions/types";
import Loading from "./Loading";
import React from "react";
import { Candidates } from "@/app/ServerFunctions/types/candidates";

export default function ResponseLanding() {
    const params = useSearchParams();
    const [received, setReceived] = useState(false);
    const queryClient = useQueryClient();
    const dataParams = params.get("data");
    const decodedParams: CampaignInviteEncodedData = (() => {
        try {
            return JSON.parse(atob(dataParams ?? btoa("{}")));
        } catch (e) {
            return {
                assignmentId: "",
                campaignId: "",
                candidateFullName: "",
                candidateId: "",
            } satisfies CampaignInviteEncodedData;
        }
    })();
    const { assignmentId, candidateId, candidateFullName, campaignId } = decodedParams;
    //#region Queries
    const candidate = useQuery({
        enabled: !!candidateId,
        queryKey: ["candidate"],
        queryFn: () => {
            return dataClient.getCandidate({ id: candidateId });
        },
    });

    const assignmentData = useQuery({
        enabled: !!assignmentId,
        queryKey: ["assignment"],
        queryFn: () => {
            return dataClient.getAssignmentData({ id: assignmentId });
        },
    });

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

    const CampaignData = useQuery({
        enabled: !!campaignId,
        queryKey: ["campaign"],
        queryFn: () => {
            return dataClient.getCampaignInfo({ id: campaignId });
        },
    });

    const parentEvent = useQuery({
        enabled: !!events.data,
        queryKey: ["parentEvent"],
        queryFn: async () => {
            const firstEvent = events.data?.[0];
            const parentEventId = firstEvent?.parentEventId;
            if (!parentEventId) throw new Error("No parent event found");
            // console.log({ firstEvent, parentEventId });
            const response = await dataClient.getEventInfo({ id: parentEventId });
            // console.log({ response });
            return response;
        },
    });

    const queries = [candidate, assignmentData, events, CampaignData, parentEvent];
    //#endregion

    //#region Error Handling
    if (!assignmentId || !candidateId || !candidateFullName) {
        return <Typography id="ErrorText">Ungültige Daten empfangen</Typography>;
    }
    if (
        candidate.isLoading ||
        assignmentData.isLoading ||
        events.isLoading ||
        CampaignData.isLoading ||
        parentEvent.isLoading
    ) {
        return <Loading textMessage="Kampagneninformationen werden geladen" spinnerSize={100} />;
    }
    if (queries.some((query) => query.isError) || !queries.every((query) => query.data)) {
        return <Typography id="ErrorText">Ein Fehler ist aufgetreten</Typography>;
    }
    //assure that query data is present
    if (
        !candidate.data ||
        !assignmentData.data ||
        !events.data ||
        !CampaignData.data ||
        !parentEvent.data
    ) {
        return <Typography id="ErrorText">Ein Fehler ist aufgetreten</Typography>;
    }
    //#endregion
    const EventHandler = {
        processResponse: async (response: boolean) => {
            queryClient.setQueryData(["candidate"], {
                ...candidate.data,
                response: response ? "accepted" : "rejected",
            });
            const dataResponse = await dataClient.processResponse({ candidateId, response });
        },
    };
    if (candidate.data.response && candidate.data.response !== "pending") {
        return (
            <ResponseReceived response={candidate.data.response as Candidates.candidateResponse} />
        );
    }
    return (
        <Box id="ResponseLandingContainer">
            {/* <Button
                onClick={() => {
                    candidate.refetch();
                    assignmentData.refetch();
                }}
                variant="contained"
            >
                Refresh
            </Button> */}
            <Typography variant="h4">
                Hallo {candidateFullName},<br />
            </Typography>
            <Typography>
                Wir würden sie gerne als Speaker für eine Kampagne unseres Kunden{" "}
                {CampaignData.data?.customerCompany} gewinnen.
            </Typography>
            <WebinarDescription webinar={parentEvent.data} campaign={CampaignData.data} />
            <Typography>
                Wir möchten dabei folgende Aufgaben in ihre Verantwortung übergeben:
            </Typography>
            <br />
            <AssignmentDescription />
            <br />
            <BudgetDescriptionText />
            <InterestDescriptionText />
            {/* <Grid container columns={5} rowGap={"10px"}>
                <Grid xs={1}>Assignment Id:</Grid>
                <Grid xs={4}>{assignmentId}</Grid>
                <Grid xs={1}>Candidate Id</Grid>
                <Grid xs={4}>{candidateId}</Grid>
            </Grid>
            <Typography whiteSpace={"pre-wrap"}>
                {JSON.stringify(decodedParams, null, "\t")}
            </Typography> */}

            <Box id="ButtonContainer">
                <Button
                    id="submitButton"
                    variant="contained"
                    onClick={() => {
                        EventHandler.processResponse(true);
                        setReceived(true);
                    }}
                >
                    Ich möchte an der Kampagne teilnehmen
                </Button>
                <Button
                    id="rejectButton"
                    variant="contained"
                    onClick={() => {
                        EventHandler.processResponse(false);
                        setReceived(true);
                    }}
                >
                    Ich möchte nicht an der Kampagne teilnehmen
                </Button>
            </Box>
        </Box>
    );
}
async function processResponse(candidateId: string, response: string) {
    // const { errors } = await publicProcessResponse({ id: candidateId, response });
    // console.log({ errors });
}
//MARK: - WebinarDescription
interface WebinarDescriptionProps {
    webinar: Webinar;
    campaign: Campaign;
}
function WebinarDescription({ webinar, campaign }: WebinarDescriptionProps) {
    if (!webinar) return <CircularProgress />;
    const { id, eventTitle, date } = webinar;
    const dateString = dayjs(date).format("DD.MM.YYYY");
    const timeString = dayjs(date).format("HH:mm");
    const customerCompany = campaign.customerCompany;
    return (
        <Typography>
            {customerCompany} werden am {dateString} um {timeString} ein Webinar zum Thema{" "}
            {webinar.eventTitle} halten.
        </Typography>
    );
}

//MARK: - AssignmentDescription
interface AssignmentDescriptionProps {
    events: TimelineEvent[];
}
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
function AssignmentDescription() {
    const queryClient = useQueryClient();
    const sortedEvents = queryClient.getQueryData<SortedEvents>(["sortedEvents"]);
    if (!sortedEvents) {
        queryClient.refetchQueries();
        return <Loading />;
    }
    const descriptionOrder = ["Invites", "Post", "Video", "WebinarSpeaker"];
    return (
        <Box id="AssignmentDescriptions">
            {descriptionOrder.map((type) => {
                return sortedEvents[type as keyof SortedEvents] ? (
                    <Box key={type} id="AssignmentDescriptionGroup">
                        {/* <Typography variant="h5">{type}</Typography> */}
                        {eventTypeDescription[type as keyof EventTypeDescription]?.({
                            events: sortedEvents[type as keyof SortedEvents],
                        }) ?? null}
                    </Box>
                ) : null;
            })}
        </Box>
    );
}

//MARK: InvitesDescription
interface InvitesDescriptionProps {
    events: TimelineEvent[];
}
function InvitesDescription({ events }: InvitesDescriptionProps) {
    const queryClient = useQueryClient();
    const webinar = queryClient.getQueryData<Webinar>(["parentEvent"]);
    const style: SxProps = useMemo(() => ({}), []);
    if (!events || !webinar) {
        queryClient.refetchQueries();
        return <Loading />;
    }
    return (
        <Box id="DescriptionContainer" sx={style}>
            <Box id="SummaryBox">
                <Typography>
                    An folgenden Terminen werden sie Einladungen zum Event des Kunden an ihre
                    Follower verschicken.
                    <br />
                    Zielgruppe für das Event sind Profile aus{" "}
                    {displayCountryString(webinar.targetAudience?.country ?? [])}, innerhalb der
                    folgenden Branchen:
                </Typography>
                <Box>
                    <List>
                        {webinar.targetAudience?.industry?.map((industry) => (
                            <Typography key={industry}>
                                {`> `}
                                {industry}
                            </Typography>
                        ))}
                    </List>
                </Box>
            </Box>
            <Table id="InvitesTable">
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Einladungen</TableCell>
                    </TableRow>
                </TableHead>
                {events.map((event) => {
                    return (
                        <TableRow key={event.id}>
                            <TableCell>{dayjs(event.date).format("dd. DD.MM")}</TableCell>
                            <TableCell>{event.eventTaskAmount}</TableCell>
                        </TableRow>
                    );
                })}
            </Table>
        </Box>
    );
}

function displayCountryString(countries: Nullable<string>[]) {
    // join elements, separated by ", ". Last element is separated by " und ". apply using regexes
    return countries.join(", ").replace(/, ([^,]*)$/, " und $1");
}

//MARK: PostDescription
interface PostDescriptionProps {
    events: TimelineEvent[];
}
function PostDescription({ events }: PostDescriptionProps) {
    return (
        <Box id="DescriptionContainer">
            {events.map((event) => {
                return (
                    <Typography key={event.id}>
                        Sie werden das Webinar des Kunden{" "}
                        {event.date && (
                            <>
                                am <strong>{`${dayjs(event.date).format("DD.MM")}`}</strong>{" "}
                            </>
                        )}
                        in einem Textbeitrag{" "}
                        {event.info?.topic && (
                            <>
                                zum Thema <strong>{`"${event.info.topic}"`}</strong>{" "}
                            </>
                        )}
                        auf ihrem LinkedIn-Profil bewerben.
                        {event.info?.draftDeadline && (
                            <>
                                <br />
                                Der Entwurf muss dabei bis zum{" "}
                                <strong>
                                    {dayjs(event.info.draftDeadline).format("DD.MM")}
                                </strong>{" "}
                                bei uns eingereicht werden.
                            </>
                        )}
                    </Typography>
                );
            })}
        </Box>
    );
}

//MARK: VideoDescription
interface VideoDescriptionProps {
    events: TimelineEvent[];
}
function VideoDescription({ events }: VideoDescriptionProps) {
    return (
        <Box id="DescriptionContainer">
            {events.map((event) => {
                return (
                    <Typography key={event.id}>
                        Sie werden das Webinar des Kunden{" "}
                        {event.date && (
                            <>
                                am <strong>{`${dayjs(event.date).format("DD.MM")}`}</strong>{" "}
                            </>
                        )}
                        in einem Videobeitrag{" "}
                        {event.info?.topic && (
                            <>
                                zum Thema <strong>{`"${event.info.topic}"`}</strong>{" "}
                            </>
                        )}
                        auf ihrem LinkedIn-Profil bewerben.
                        {event.info?.draftDeadline && (
                            <>
                                <br />
                                Die Aufnahme muss dabei bis zum{" "}
                                <strong>
                                    {dayjs(event.info.draftDeadline).format("DD.MM")}
                                </strong>{" "}
                                bei uns eingereicht werden.
                            </>
                        )}
                    </Typography>
                );
            })}
        </Box>
    );
}

//MARK: WebinarSpeakerDescription
interface WebinarSpeakerDescriptionProps {
    events: TimelineEvent[];
}
function WebinarSpeakerDescription({ events }: WebinarSpeakerDescriptionProps) {
    const queryClient = useQueryClient();
    const webinar = queryClient.getQueryData<Webinar>(["parentEvent"]);
    if (!events || !webinar) {
        queryClient.refetchQueries();
        return <Loading />;
    }
    return (
        <Box id="DescriptionContainer">
            {events.map((event) => {
                return (
                    <Typography key={event.id}>
                        Sie werden{" "}
                        {webinar.date && (
                            <>
                                am <strong>{dayjs(webinar.date).format("DD.MM")}</strong>{" "}
                            </>
                        )}
                        als Speaker am Webinar des Kunden teilnehmen.
                        <br />
                        Dort sollen sie zum Thema <strong>{`"${event.eventTitle}"`}</strong>{" "}
                        sprechen.
                    </Typography>
                );
            })}
        </Box>
    );
}

//MARK: BudgetDescriptionText
function BudgetDescriptionText() {
    const queryClient = useQueryClient();
    const assignmentData = queryClient.getQueryData<Assignment>(["assignment"]);
    if (!assignmentData) {
        queryClient.refetchQueries();
        return <Loading />;
    }
    return (
        <Typography>
            Für diese Aufgaben werden sie mit einem Honorar von{" "}
            <strong>{assignmentData.budget} €</strong> vergütet.
        </Typography>
    );
}

//Mark: InterestDescriptionText
function InterestDescriptionText() {
    return (
        <Typography>
            Wir haben sie aufgrund ihrer Expertise und ihres Interesses an den Themen des Kunden
            ausgewählt. Bitte teilen sie uns mit, ob sie an der Kampagne teilnehmen möchten.
            <br />
            Wir werden ihre Entscheidung an unseren Kunden weiterleiten und sie zeitnah über deren
            Auswahl informieren.
        </Typography>
    );
}

//MARK: Response Received
interface ResponseReceivedProps {
    response: Candidates.candidateResponse;
}
function ResponseReceived({ response }: ResponseReceivedProps) {
    if (response === "rejected") {
        return (
            <Box id="ResponseReceivedContainer">
                <Typography>
                    Vielen Dank für Ihr Feedback. Wir bedauern, dass Sie nicht interessiert sind,
                    mit uns zusammenzuarbeiten. Wir werden Ihre Entscheidung an unseren Kunden
                    weiterleiten.
                </Typography>
            </Box>
        );
    }
    return (
        <Box id="ResponseReceivedContainer">
            <Typography>
                Ihre Antwort wurde erfolgreich übermittelt. Vielen Dank für ihre Rückmeldung.
            </Typography>
            <Typography>Wir werden sie über die Auswahl des Kunden informieren.</Typography>
        </Box>
    );
}
