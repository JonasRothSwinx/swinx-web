import { ExpandMoreIcon } from "@/app/Definitions/Icons";
import { Influencer, TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs, { Dayjs } from "@/app/configuredDayJs";

type OpenInfluencerDetailsProps = {
    influencers: Influencer.Placeholder[];
    setHighlightedEvent: Dispatch<SetStateAction<TimelineEvent.TimelineEvent | undefined>>;
};

export default function OpenInfluencerDetails(props: OpenInfluencerDetailsProps) {
    const { influencers, setHighlightedEvent } = props;
    const [openInfluencers, setOpenInfluencers] = useState<Influencer.Placeholder[]>([]);
    useEffect(() => {
        // function getInfluencers() {
        //     const involvedInfluencers: Influencer.Placeholder[] = [];

        //     for (const event of events) {
        //         const influencer = influencers.find(
        //             (x) => x.id === event.influencerPlaceholder?.id,
        //         );
        //         if (!influencer) continue;
        //         const involvedInfluencer = involvedInfluencers.find((x) => x.id === influencer.id);
        //         switch (true) {
        //             case TimelineEvent.isInviteEvent(event): {
        //                 if (!event.inviteEvent) continue;
        //                 if (involvedInfluencer) {
        //                     involvedInfluencer.inviteEvents.push(event);
        //                 } else {
        //                     involvedInfluencers.push({ ...influencer, inviteEvents: [event] });
        //                 }
        //                 break;
        //             }
        //             default:
        //                 break;
        //         }
        //     }
        //     for (const influencer of involvedInfluencers) {
        //         influencer.inviteEvents.sort((a, b) =>
        //             a.date && b.date ? a.date.localeCompare(b.date) : 0,
        //         );
        //     }
        //     return involvedInfluencers;
        // }
        // setOpenInfluencers(getInfluencers());
        return () => {};
    }, [influencers]);
    return (
        <Accordion defaultExpanded disableGutters elevation={5}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                Offene Influencer Positionen
            </AccordionSummary>
            <AccordionDetails>
                {openInfluencers.map((influencer) => {
                    // console.log(influencer);
                    return (
                        <Accordion key={influencer.id} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                {influencer.name}
                            </AccordionSummary>
                            <AccordionDetails>
                                {influencer.timelineEvents.length > 0 && (
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            Invites:{" "}
                                            {/* {influencer.timelineEvents.reduce(
                                                (sum: number, event) => {
                                                    return sum + (event?.inviteEvent?.invites ?? 0);
                                                },
                                                0,
                                            )}{" "} */}
                                            verteilt über {influencer.timelineEvents.length} Termine
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                {influencer.timelineEvents.map((event) => {
                                                    const date = dayjs(event.date);
                                                    return (
                                                        <Grid
                                                            xs={12}
                                                            key={event.id}
                                                            onClick={() => {
                                                                setHighlightedEvent(event);
                                                            }}
                                                        >
                                                            <Typography>
                                                                {date.format("DD.MM.YYYY")} (
                                                                {date.fromNow()})
                                                            </Typography>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </AccordionDetails>
        </Accordion>
    );
}
