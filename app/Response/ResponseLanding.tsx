import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { Box, Button, CircularProgress, Icon, SxProps, Typography, useMediaQuery } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { dataClient } from "./Functions/Database";
import { Assignment, Candidate } from "./Functions/Database/types";
import sortEvents from "./Functions/sortEvents";
import Loading from "./Components/Loading";
import notifyResponse from "./Functions/Notifications/notifyResponse";
import { WebinarDescription } from "./Components/WebinarDescription";
import { AssignmentDescription } from "./Components/AssignmentDescription";
import { BudgetDescriptionText } from "./Components/BudgetDescriptionText";
import { InterestDescriptionText } from "./Components/InterestDescriptionText";
import { ResponseReceived } from "./Components/ResponseReceived";
import { SwinxLogo } from "./Components/SwinxLogo";
import Title from "./Components/Title";
import Introduction from "./Components/Introduction";
import { Engineering } from "@mui/icons-material";
import sleep from "../utils/sleep";
import ResponseButtons from "./Components/ResponseButtons";

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
    const isLowHeight = useMediaQuery("(max-height: 600px)");
    const isLowWidth = useMediaQuery("(max-width: 600px)");
    const [responseClicked, setResponseClicked] = useState(false);
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
                maxHeight: "calc(100dvh - 40px)",
                maxWidth: "100vw",
                margin: "20px",
                border: "1px solid gray",
                borderRadius: "10px",
                backgroundColor: "var(--background-color)",
                display: "flex",
                flexDirection: "column",
                // overflowY: "auto",
                "#ResponseLandingScrollableContent": {
                    padding: "20px",
                    paddingTop: "0",
                    maxHeight: "-webkit-fill-available",
                    // maxHeight: "calc(100dvh - 40px)",
                    overflowY: "auto",
                    flex: 1,
                    "@media (max-width: 600px)": {
                        overflowY: "auto",
                    },
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
                "#Title": {
                    // position: "sticky",
                    padding: "20px",
                    paddingBottom: "0",
                    width: "100%",
                    textAlign: "center",
                    "#SwinxLogo": {
                        float: "right",
                        width: "100px",
                        height: "2em",
                        marginInlineStart: "10px",
                    },
                },

                "#AssignmentDescriptionsContainer": {
                    overflowY: "auto",
                    border: "1px solid black",
                    borderRadius: "5px",
                    maxHeight: "80%",
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
                                // float: "left",
                                flex: 3,
                            },
                            "#InvitesTable": {
                                // float: "right",
                                overflowY: "auto",
                                height: "fit-content",
                                width: "fit-content",
                                maxHeight: "fit-content",
                                flex: 1,
                                "& .MuiTableCell-head": {
                                    fontWeight: "bold",
                                    padding: "10px",
                                },
                                "& .MuiTableCell-root": {
                                    padding: "5px",
                                    width: "10em",
                                    textAlign: "center",
                                    height: "fit-content",
                                },
                            },
                        },
                        "@media (max-width: 500px)": {
                            maxHeight: "fit-content",

                            "#SummaryContainer": {
                                flexDirection: "column",
                                alignItems: "center",
                                "#SummaryBox": {
                                    width: "100%",
                                },
                                "#InvitesTable": {
                                    width: "fit-content",
                                },
                            },
                        },
                    },
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
            },
        }),
        []
    );
    //#endregion
    //MARK: - Event Handler
    const EventHandler = {
        processResponse: async (response: Candidates.candidateResponse, feedback?: string) => {
            if (!CampaignData.data) return;
            setResponseClicked(true);
            // await sleep(5000);
            console.log("preocessRespone", { response, feedback });
            // return;

            const dataResponse = await dataClient.processResponse({ candidateId, response, feedback });
            queryClient.setQueryData(["candidate"], {
                ...candidate.data,
                feedback: feedback,
                response: response,
            });

            setResponseClicked(false);
            await notifyResponse({
                response,
                influencerName: candidateFullName,
                customerCompany: CampaignData.data.customerCompany,
                campaignId,
                feedback,
            });
        },
        resetResponse: async () => {
            await EventHandler.processResponse("pending");
            queryClient.setQueryData(["candidate"], {
                ...candidate.data,
                response: "pending",
            });
        },
    };
    //MARK: - small screen handling
    // if (!(process.env.NODE_ENV === "development") && (isLowHeight || isLowWidth)) {
    //     return (
    //         <Box id="TempMessageBox">
    //             <Box
    //                 height={50}
    //                 sx={{
    //                     "& svg": {
    //                         fontSize: "50px",
    //                     },
    //                 }}
    //             >
    //                 <Engineering htmlColor="red" />
    //             </Box>
    //             <Typography variant="h5">Fenstergröße zu klein</Typography>
    //             <Typography>
    //                 Die Anzeige dieser Seite auf einem mobilen Gerät oder in kleinen Fenstern wird
    //                 nicht unterstützt.
    //                 <br /> Bitte verwenden Sie einen Laptop, ein Tablet mit größerem Bildschirm,
    //                 oder vergrössern sie ihr Browser Fenster.
    //                 <br />
    //                 <br />
    //                 Wir arbeiten daran, dieses Problem zu beheben.
    //             </Typography>
    //         </Box>
    //     );
    // }
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
    if (!candidate.data || !assignmentData.data || !events.data || !CampaignData.data || !parentEvent.data) {
        return <Typography id="ErrorText">Ein Fehler ist aufgetreten</Typography>;
    }
    if (candidate.data.response && candidate.data.response !== "pending") {
        return (
            <ResponseReceived
                response={candidate.data.response as Candidates.candidateResponse}
                resetResponse={EventHandler.resetResponse}
            />
        );
    }
    //#endregion
    //Temporary fix for the issue

    return (
        <Box id="ResponseLandingContainer" sx={styles}>
            <Title />
            <Box id="ResponseLandingScrollableContent">
                <Introduction
                    candidateFullName={candidateFullName}
                    webinar={parentEvent.data}
                    CampaignData={CampaignData.data}
                />
                <br />
                <AssignmentDescription assignmentId={assignmentId} />
                <br />
                <InterestDescriptionText />
            </Box>
            <ResponseButtons processResponse={EventHandler.processResponse} />
        </Box>
    );
}
