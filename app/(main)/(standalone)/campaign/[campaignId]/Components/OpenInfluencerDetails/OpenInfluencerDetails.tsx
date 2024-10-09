import { AddIcon, ExpandMoreIcon } from "@/app/Definitions/Icons";
import {
    Assignment,
    Campaign,
    Influencer,
    Event,
    Events,
    Influencers,
    Assignments,
} from "@/app/ServerFunctions/types";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Skeleton,
    Typography,
} from "@mui/material";
import { randomDesk, randomId } from "@mui/x-data-grid-generator";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AssignedInfluencer from "./AssignedInfluencer";
import { dataClient } from "@dataClient";

type OpenInfluencerDetailsProps = {
    // influencers: Influencers.Full[];
    campaignId: string;
    // setCampaign: (campaign: Campaign) => void;
    // placeholders: Assignment[];
    // events: Event[];
};

type eventDict = { [key: string]: Event[] };

export default function OpenInfluencerDetails({
    campaignId,
}: // setCampaign,
// events,
// placeholders,
// influencers,
OpenInfluencerDetailsProps) {
    const queryClient = useQueryClient();
    const assignments = useQuery({
        queryKey: ["assignments", campaignId],
        queryFn: ({ queryKey }) => {
            const [, campaignId] = queryKey;
            const assignments = dataClient.assignment.byCampaign(campaignId);
            return assignments;
        },
    });
    // const [assignedInfluencers, setAssignedInfluencers] = useState<Assignment[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    // const [targetAssignment, setTargetAssignment] = useState<Assignment>();

    // useEffect(() => {
    //     function getInfluencers() {
    //         // debugger;
    //         // console.log(openInfluencers);
    //         const assignments: Assignment[] = campaign.data.assignedInfluencers ?? [];

    //         for (const event of events /* .filter((event) => event.assignment.isPlaceholder) */) {
    //             switch (true) {
    //                 case Events.isSingleEvent(event): {
    //                     const assignment = assignments.find(
    //                         (x) => x.id === event.assignments[0]?.id,
    //                     );
    //                     if (!assignment) continue;
    //                     if (assignment.timelineEvents.find((x) => x.id === event.id)) {
    //                         continue;
    //                     }

    //                     assignment.timelineEvents.push(event);
    //                     break;
    //                 }
    //                 case Events.isMultiEvent(event): {
    //                     const assignment = assignments.find((x) =>
    //                         event.assignments?.find((y) => {
    //                             y.id === x.id;
    //                         }),
    //                     );
    //                     if (!assignment) continue;
    //                     if (assignment.timelineEvents.find((x) => x.id === event.id)) {
    //                         continue;
    //                     }

    //                     assignment.timelineEvents.push(event);
    //                     break;
    //                 }
    //             }
    //         }

    //         for (const assignment of assignments) {
    //             assignment.timelineEvents.sort((a, b) =>
    //                 a.date && b.date ? a.date.localeCompare(b.date) : 0,
    //             );
    //         }
    //         return assignments;
    //     }
    //     setAssignedInfluencers(getInfluencers());
    //     return () => {};
    // }, [/* placeholders,  */ events, campaign.data]);
    const EventHandlers = {
        addAssignment: useMutation({
            mutationFn: async () => {
                const newCreatedAssignment = await dataClient.assignment.create({ campaignId });

                return { newCreatedAssignment };
            },
            onMutate(variables) {
                console.log("Mutating", variables);
                const placeholderAssignment: Assignments.Min = {
                    id: "placeholder-" + randomId(),
                    placeholderName: "Neuer Influencer",
                    budget: 0,
                    campaign: { id: campaignId },
                    timelineEvents: [],
                    influencer: null,
                };
                queryClient.setQueryData(["assignments", campaignId], (old: Assignment[]) => [
                    ...old,
                    placeholderAssignment,
                ]);
                return { placeholderAssignment };
            },
            onSettled: async (data, error) => {
                console.log("Settled", data);

                // await queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
                await queryClient.invalidateQueries({ queryKey: ["assignments", campaignId] });
                if (error) console.error(error);
            },

            onSuccess: (data, variables, context) => {
                const { newCreatedAssignment } = data;
                const { placeholderAssignment } = context;
                console.log("Success", data);
                queryClient.setQueryData(["assignments", campaignId], (old: Assignment[]) => {
                    const newAssignments = old.map((assignment) => {
                        if (assignment.id === placeholderAssignment.id) {
                            return newCreatedAssignment;
                        }
                        return assignment;
                    });
                    return newAssignments;
                });
                queryClient.setQueryData(
                    ["assignment", newCreatedAssignment.id],
                    newCreatedAssignment,
                );
                // queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
                // queryClient.invalidateQueries({ queryKey: ["assignments", campaignId] });
            },
        }),
    };
    if (assignments.isError) {
        console.error(assignments.error);
        return <Box>{assignments.error?.message}</Box>;
    }
    if (assignments.isLoading) {
        return (
            <Accordion
                defaultExpanded
                disableGutters
            >
                <AccordionSummary>
                    <Typography>Lade...</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Skeleton height={"200px"} />
                </AccordionDetails>
            </Accordion>
        );
    }

    return (
        <>
            <>{/* Dialogs */}</>
            <Accordion
                defaultExpanded
                disableGutters
                variant="outlined"
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Influencer
                </AccordionSummary>
                <AccordionDetails>
                    {assignments.data && (
                        <>
                            {assignments.data.map((assignment) => {
                                // console.log(influencer);
                                return (
                                    <AssignedInfluencer
                                        key={assignment.id}
                                        campaignId={campaignId}
                                        assignedInfluencer={assignment}
                                        // campaign={campaign}
                                        // setCampaign={setCampaign}
                                        // influencers={influencers}
                                        isProcessing={isProcessing}
                                        setIsProcessing={setIsProcessing}
                                    />
                                );
                            })}
                            <Button
                                onClick={() => EventHandlers.addAssignment.mutate()}
                                disabled={EventHandlers.addAssignment.isPending}
                            >
                                <AddIcon />
                                <Typography>Neuer Influencer</Typography>
                                {(EventHandlers.addAssignment.isPending || isProcessing) && (
                                    <CircularProgress />
                                )}
                            </Button>
                        </>
                    )}
                </AccordionDetails>
            </Accordion>
        </>
    );
}
