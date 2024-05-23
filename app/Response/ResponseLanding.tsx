import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { Box, Button, Icon, SxProps, Typography, useMediaQuery } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { dataClient } from "./Functions/Database";
import { Assignment } from "./Functions/Database/types";
import sortEvents from "./Functions/sortEvents";
import Loading from "./Components/Loading";
import notifyResponse from "./Functions/notifyResponse";
import { WebinarDescription } from "./Components/WebinarDescription";
import { AssignmentDescription } from "./Components/AssignmentDescription";
import { BudgetDescriptionText } from "./Components/BudgetDescriptionText";
import { InterestDescriptionText } from "./Components/InterestDescriptionText";
import { ResponseReceived } from "./Components/ResponseReceived";
import { SwinxLogo } from "./Components/SwinxLogo";
import Title from "./Components/Title";
import Introduction from "./Components/Introduction";
import { Engineering } from "@mui/icons-material";

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
    const isLowHeight = useMediaQuery("(min-height: 600px)");
    const isLowWidth = useMediaQuery("(min-width: 600px)");
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

    // const sortedEvents = useQuery({
    //     enabled: !!events.data,
    //     queryKey: ["sortedEvents"],
    //     queryFn: () => {
    //         if (!events.data) return {};
    //         return sortEvents({ events: events.data });
    //     },
    // });

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
                "#ErrorText": {
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    fontSize: "30px",
                    marginTop: "100px",
                    textShadow: "2px 2px 2px black",
                    color: "red",
                },
                "#Title": {
                    width: "100%",
                    "#SwinxLogo": {
                        float: "right",
                        width: "100px",
                        height: "2em",
                        marginInlineStart: "10px",
                    },
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
    if (isLowHeight || isLowWidth) {
        return (
            <Box id="TempMessageBox">
                <Box
                    height={50}
                    sx={{
                        "& svg": {
                            fontSize: "50px",
                        },
                    }}
                >
                    <Engineering htmlColor="red" />
                </Box>
                <Typography variant="h5">Fenstergröße zu klein</Typography>
                <Typography>
                    Die Anzeige dieser Seite auf einem mobilen Gerät oder in kleinen Fenstern wird
                    nicht unterstützt. Bitte verwenden Sie ein Gerät mit größerem Bildschirm.
                    <br />
                    <br />
                    Wir arbeiten daran, dieses Problem zu beheben.
                </Typography>
            </Box>
        );
    }
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
        return <Loading textMessage="Kampagne wird geladen" spinnerSize={100} />;
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
    //Temporary fix for the issue

    return (
        <Box id="ResponseLandingContainer" sx={styles}>
            <Title />
            <Introduction
                candidateFullName={candidateFullName}
                webinar={parentEvent.data}
                CampaignData={CampaignData.data}
            />
            <br />
            <AssignmentDescription assignmentId={assignmentId} />
            <br />
            <InterestDescriptionText />

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
