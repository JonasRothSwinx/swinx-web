import { Nullable } from "@/app/Definitions/types";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import dayjs from "@/app/utils/configuredDayJs";
import {
    Box,
    Button,
    CircularProgress,
    List,
    SxProps,
    Table,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { dataClient } from "../Functions/Database";
import { Assignment, Campaign, TimelineEvent, Webinar } from "../Functions/Database/types";
import sortEvents, { SortedEvents } from "../Functions/sortEvents";
import Loading from "./Loading";
import notifyResponse from "../Functions/notifyResponse";

export default function ResponseLanding() {
    const params = useSearchParams();
    // const [received, setReceived] = useState(false);
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
    //#region styles
    const styles: SxProps = useMemo(
        () => ({
            "&": {
                "--background-color": "white",
                position: "relative",
                width: "100vw",
                height: "100vh",
                display: "flex",
                "& #ResponseLandingContainer": {
                    position: "relative",
                    width: "calc(100vw - 40px)", // Account for left and right margins
                    height: "fit-content", // Account for top and bottom margins
                    maxHeight: "calc(100vh - 40px)",
                    maxWidth: "100vw",
                    padding: "20px",
                    margin: "20px",
                    borderRadius: "10px",
                    backgroundColor: "var(--background-color)",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                },
                "#ErrorText": {
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    fontSize: "30px",
                    marginTop: "100px",
                    textShadow: "2px 2px 2px black",
                    color: "red",
                },
                "#LoadingContainer": {
                    width: "100%",
                    height: "--webkit-fill-available",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                },
                "#ButtonContainer": {
                    // boxSizing: "border-box",
                    // position: "absolute",
                    // bottom: "0",
                    // right: "0",
                    float: "right",
                    alignSelf: "flex-end",
                    display: "flex",
                    flexWrap: "wrap",
                    // flexDirection: "column",
                    justifyContent: "right",
                    alignItems: "end",
                    width: "max-content",
                    maxWidth: "100%",
                    "& button": {
                        width: "fit-content",
                        margin: "10px",
                    },
                    "#submitButton": {
                        backgroundColor: "primary",
                    },
                    "#rejectButton": {
                        backgroundColor: "secondary",
                    },
                },
                "#DescriptionContainer": {
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "400px",
                    background: "var(--background-color)",
                    // padding: "2px",
                    // border: "1px solid black",
                    // borderRadius: "5px",
                    "#DescriptionTitle": {
                        fontWeight: "bold",
                        fontSize: "20px",
                        padding: "10px",
                        color: "white",
                        backgroundColor: "var(--swinx-blue)",
                    },
                    "#SummaryContainer": {
                        display: "flex",
                        flexDirection: "row",
                        paddingLeft: "10px",
                        "#SummaryBox": {
                            flex: 3,
                        },
                        "#InvitesTable": {
                            overflowY: "auto",
                            flex: 1,
                            "& .MuiTableCell-head": {
                                fontWeight: "bold",
                                padding: "10px",
                            },
                            "& .MuiTableCell-root": {
                                padding: "5px",
                                width: "10em",
                                textAlign: "center",
                            },
                        },
                    },
                },
                "#AssignmentDescriptionsContainer": {
                    overflowY: "auto",
                    border: "1px solid black",
                    borderRadius: "5px",
                },
                "#AssignmentDescriptionGroup": {
                    display: "flex",
                    flexDirection: "column",
                    // padding: "10px",
                    borderBlock: "1px solid black",
                    overflow: "auto",

                    borderBottom: "none",
                    "&:first-of-type": {
                        borderTop: "none",
                        // borderTopLeftRadius: "5px",
                        // borderTopRightRadius: "5px",
                        // marginBottom: "10px",
                    },
                    "&:last-of-type": {
                        borderBottom: "none",
                        // borderBottomLeftRadius: "5px",
                        // borderBottomRightRadius: "5px",
                    },
                },
                "#ResponseReceivedContainer": {
                    padding: "40px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "10px",
                    border: "1px solid black",
                    "& #ResponseReceivedText": {
                        fontSize: "30px",
                        margin: "10px",
                    },
                    "& #ResponseReceivedButton": {
                        margin: "10px",
                    },
                },
            },
        }),
        [],
    );
    //#endregion
    const EventHandler = {
        processResponse: async (response: boolean) => {
            // queryClient.setQueryData(["candidate"], {
            //     ...candidate.data,
            //     response: response ? "accepted" : "rejected",
            // });
            if (!CampaignData.data) return;
            const dataResponse = await dataClient.processResponse({ candidateId, response });

            await notifyResponse({
                response,
                candidateFullName,
                customerCompany: CampaignData.data.customerCompany,
                campaignId,
            });
        },
    };
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
    if (candidate.data.response && candidate.data.response !== "pending") {
        return (
            <ResponseReceived response={candidate.data.response as Candidates.candidateResponse} />
        );
    }
    //#endregion

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
            <SwinxLogo />
            <Typography variant="h4">Werden Sie Teil unserer Kampagne</Typography>
            <Typography>
                Hallo {candidateFullName},<br />
                Wir würden Sie gerne als Speaker für eine Kampagne unseres Kunden{" "}
                <strong>{CampaignData.data?.customerCompany}</strong> gewinnen.
            </Typography>
            <WebinarDescription webinar={parentEvent.data} campaign={CampaignData.data} />
            <BudgetDescriptionText />
            <Typography>
                Wir möchten dabei folgende Aufgaben in Ihre Verantwortung übergeben:
            </Typography>
            <br />
            <AssignmentDescription />
            <br />
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
                    color="primary"
                    onClick={() => {
                        EventHandler.processResponse(true);
                        // setReceived(true);
                    }}
                >
                    Ich möchte an der Kampagne teilnehmen
                </Button>
                <Button
                    id="rejectButton"
                    variant="outlined"
                    color="info"
                    onClick={() => {
                        EventHandler.processResponse(false);
                        // setReceived(true);
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
            {customerCompany} werden am{" "}
            <strong>
                {dateString} um {timeString}
            </strong>{" "}
            ein Webinar zum Thema <strong>{`"${webinar.eventTitle}"`}</strong> halten.
        </Typography>
    );
}

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
function AssignmentDescription() {
    const queryClient = useQueryClient();
    const sortedEvents = queryClient.getQueryData<SortedEvents>(["sortedEvents"]);
    if (!sortedEvents) {
        queryClient.refetchQueries();
        return <Loading />;
    }
    const descriptionOrder = ["Invites", "Post", "Video", "WebinarSpeaker"];
    return (
        <Box id="AssignmentDescriptionsContainer">
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
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Einladungen</Typography>
            </Box>
            <Box id="SummaryContainer">
                <Box id="SummaryBox">
                    <Typography>
                        An folgenden Terminen werden Sie Einladungen zum Event des Kunden an Ihre
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
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Textbeiträge</Typography>
            </Box>
            <Box id="SummaryContainer">
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
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Videobeiträge</Typography>
            </Box>
            <Box id="SummaryContainer">
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
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Webinar Speaker</Typography>
            </Box>
            <Box id="SummaryContainer">
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
                            Dort sollen Sie zum Thema <strong>{`"${event.eventTitle}"`}</strong>{" "}
                            sprechen.
                        </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}

//MARK: BudgetDescriptionText
function BudgetDescriptionText() {
    // const queryClient = useQueryClient();
    // const assignmentData = queryClient.getQueryData<Assignment>(["assignment"]);
    // if (!assignmentData) {
    //     queryClient.refetchQueries();
    //     return <Loading />;
    // }
    // return (
    //     <Typography>
    //         Für ihren Aufwand werden Sie mit einem Honorar von{" "}
    //         <strong>{assignmentData.budget} €</strong> vergütet.
    //     </Typography>
    // );
    return (
        <Typography>
            Für ihren Aufwand werden Sie mit einem attraktiven Honorar vergütet.
        </Typography>
    );
}

//Mark: InterestDescriptionText
function InterestDescriptionText() {
    return (
        <Typography>
            Wir haben Sie aufgrund ihrer Expertise und ihres Interesses an den Themen des Kunden
            ausgewählt. Bitte teilen Sie uns mit, ob Sie an der Kampagne teilnehmen möchten.
            <br />
            Wir werden Ihre Entscheidung an unseren Kunden weiterleiten und Sie zeitnah über deren
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
                Ihre Antwort wurde erfolgreich übermittelt. Vielen Dank für Ihre Rückmeldung.
            </Typography>
            <Typography>Wir werden Sie über die Auswahl des Kunden informieren.</Typography>
        </Box>
    );
}

//MARK: SwinxLogo
function SwinxLogo() {
    const style: SxProps = useMemo(
        () => ({
            position: "absolute",
            right: "40px",
            top: 0,
            width: "fit-content",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // mt: 2,
        }),
        [],
    );
    return (
        <Box id="SwinxLogo" sx={style}>
            <Image src="/swinx-logo.svg" alt="Swinx Logo" width={100} height={50} />
        </Box>
    );
}
