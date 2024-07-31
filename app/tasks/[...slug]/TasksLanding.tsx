import { Box, SxProps, Typography, useMediaQuery } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LoadingPage } from "@/app/Components";
import Title from "./Components/Title";
import { dataClient } from "./Functions/Database";
import TaskDisplay from "./Task Display/TaskDisplay";
import { Summary } from "./Summary";

interface TasksLandingProps {
    assignmentId: string;
    // campaignId: string;
    // influencerId: string;
    openedEvent?: string | null;
}
export default function TasksLanding({
    assignmentId,
    // campaignId,
    // influencerId,
    openedEvent = null,
}: TasksLandingProps) {
    // const [received, setReceived] = useState(false);
    const queryClient = useQueryClient();

    // const isLowHeight = useMediaQuery("(max-height: 600px)");
    // const isLowWidth = useMediaQuery("(max-width: 600px)");
    // const [responseClicked, setResponseClicked] = useState(false);
    //#region Queries

    const task = useQuery({
        queryKey: ["task"],
        queryFn: async () => {
            console.log("Task data requested");
            const response = await dataClient.getTaskDetails({
                assignmentId: assignmentId,
                // campaignId: campaignId,
                // influencerId: influencerId,
            });
            return response;
        },
    });

    const [assignment, events, campaign, influencer] = useMemo(() => {
        // console.log("Task data changed");
        const assignment = task.data?.assignmentData ?? null;
        const events = task.data?.events ?? null;
        const campaign = task.data?.campaignInfo ?? null;
        const influencer = task.data?.influencerInfo ?? null;
        return [assignment, events, campaign, influencer];
    }, [task.data]);

    const parentEvent = useQuery({
        enabled: events !== null && events?.length > 0,
        queryKey: ["parentEvent"],
        queryFn: async () => {
            if (!events) throw new Error("No events found");
            const firstEvent = events[0];
            const parentEventId = firstEvent?.parentEventId;
            if (!parentEventId) throw new Error("No parent event found");
            // console.log({ firstEvent, parentEventId });
            const response = await dataClient.getEventInfo({ id: parentEventId });
            // console.log({ response });
            return response;
        },
    });

    //#endregion
    //#region styles
    const styles: SxProps = useMemo(
        () => ({
            "&": {
                position: "relative",
                // width: "calc(100vw - 40px)", // Account for left and right margins
                // height: "fit-content", // Account for top and bottom margins
                width: "100%",
                height: "100%",
                maxHeight: "100vh",
                // maxHeight: "calc(100dvh - 40px)",
                maxWidth: "100vw",
                // margin: "20px",
                // border: "1px solid gray",
                // borderRadius: "10px",
                // backgroundColor: "var(--background-color)",
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden",
                overflowX: "hidden",

                "#ErrorText": {
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    fontSize: "30px",
                    marginTop: "100px",
                    textShadow: "2px 2px 2px black",
                    color: "red",
                },
                ".TaskSummaryBody": {
                    padding: "0px",
                    flex: 1,
                    // maxHeight: "100%",
                    display: "flex",
                    overflow: "hidden",
                    overflowY: "scroll",
                    ".TaskDescriptionContainer": {
                        display: "flex",
                        flexDirection: "column",
                        // borderTop: "1px solid black",
                        borderRadius: "10px 10px 0 0",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: "10px 20px",
                        flex: 1,
                        height: "fit-content",
                        // overflowY: "scroll",
                        maxWidth: "1300px",
                        // width: "100%",
                        // justifyContent: "center",
                        // paddingRight: "10px",
                        // maxHeight: "100%",
                    },
                    ".ScrollableContent": {
                        // padding: "20px",
                        // margin: "0 auto",
                        // display: "flex",
                        // flexDirection: "column",
                        // alignItems: "center",
                        paddingTop: "0",
                        // margin: "0 auto",
                        // "maxHeight": "-webkit-fill-available",
                        // maxHeight: "calc(100dvh - 40px)",
                        // overflowY: "auto",
                        // "flex": 1,
                        // maxWidth: "1000px",
                    },
                },

                // "#AssignmentDescriptionsContainer": {
                //     overflowY: "auto",
                //     border: "1px solid black",
                //     borderRadius: "5px",
                //     maxHeight: "80%",
                //     "#DescriptionContainer": {
                //         display: "flex",
                //         flexDirection: "column",
                //         maxHeight: "400px",

                //         background: "var(--background-color)",
                //         // padding: "2px",
                //         // border: "1px solid black",
                //         // borderRadius: "5px",
                //         "#DescriptionTitle": {
                //             fontWeight: "bold",
                //             fontSize: "20px",
                //             padding: "10px",
                //             color: "white",
                //             backgroundColor: "var(--swinx-blue)",
                //         },
                //         "#SummaryContainer": {
                //             display: "flex",
                //             flexDirection: "row",
                //             paddingLeft: "10px",
                //             "#SummaryBox": {
                //                 // float: "left",
                //                 flex: 3,
                //             },
                //             "#InvitesTable": {
                //                 // float: "right",
                //                 overflowY: "auto",
                //                 height: "fit-content",
                //                 width: "fit-content",
                //                 maxHeight: "fit-content",
                //                 flex: 1,
                //                 "& .MuiTableCell-head": {
                //                     fontWeight: "bold",
                //                     padding: "10px",
                //                 },
                //                 "& .MuiTableCell-root": {
                //                     padding: "5px",
                //                     width: "10em",
                //                     textAlign: "center",
                //                     height: "fit-content",
                //                 },
                //             },
                //         },
                //         "@media (max-width: 500px)": {
                //             maxHeight: "fit-content",

                //             "#SummaryContainer": {
                //                 flexDirection: "column",
                //                 alignItems: "center",
                //                 "#SummaryBox": {
                //                     width: "100%",
                //                 },
                //                 "#InvitesTable": {
                //                     width: "fit-content",
                //                 },
                //             },
                //         },
                //     },
                // },
                // "#AssignmentDescriptionGroup": {
                //     display: "flex",
                //     flexDirection: "column",
                //     // padding: "10px",
                //     borderBlock: "1px solid black",
                //     overflow: "auto",

                //     borderBottom: "none",
                //     "&:first-of-type": {
                //         borderTop: "none",
                //         // borderTopLeftRadius: "5px",
                //         // borderTopRightRadius: "5px",
                //         // marginBottom: "10px",
                //     },
                //     "&:last-of-type": {
                //         borderBottom: "none",
                //         // borderBottomLeftRadius: "5px",
                //         // borderBottomRightRadius: "5px",
                //     },
                // },
            },
        }),
        [],
    );
    //#endregion
    //MARK: - Event Handler
    const EventHandler = {};

    //#region Error Handling
    if (!assignmentId) {
        return <Typography id="ErrorText">Ungültige Daten empfangen</Typography>;
    }
    if (task.isLoading || parentEvent.isLoading) {
        return (
            <LoadingPage
                textMessage="Kampagne wird geladen"
                spinnerSize={100}
            />
        );
    }
    if (
        task.isError ||
        parentEvent.isError ||
        !task.data ||
        !parentEvent.data ||
        parentEvent.data === null ||
        !assignment ||
        !events ||
        !campaign ||
        !influencer
    ) {
        console.log({
            task,
            data: task.data,
            parentEvent,
            context: {
                parentEvent: parentEvent.data,
                assignment,
                events,
                campaign,
                influencer,
            },
        });
        return (
            <Box>
                <Typography id="ErrorText">Ein Fehler ist aufgetreten</Typography>
                <Typography id="ErrorText">{task.error?.message}</Typography>
            </Box>
        );
    }

    //#endregion
    //Temporary fix for the issue

    return (
        <>
            <Box
                id="ResponseLandingContainer"
                sx={styles}
            >
                <Title
                    parentEvent={parentEvent.data}
                    campaign={campaign}
                />
                <Box
                    id="TaskSummaryBody"
                    className="TaskSummaryBody"
                >
                    <Box
                        id="TaskDescriptionContainer"
                        className="TaskDescriptionContainer"
                    >
                        <Summary
                            influencerFullName={`${influencer.firstName} ${influencer.lastName}`}
                            webinar={parentEvent.data}
                            campaign={campaign}
                            events={events}
                        />
                        <Box
                            id="TasksScrollableContent"
                            className="ScrollableContent"
                        >
                            <TaskDisplay
                                tasks={events}
                                parentEvent={parentEvent.data}
                                campaign={campaign}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
