// import { ExpandMoreIcon } from "@/app/Definitions/Icons";
// import Influencer from "@/app/ServerFunctions/types/influencer";
// import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
// import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
// import Grid from "@mui/material/Unstable_Grid2/Grid2";
// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import dayjs, { Dayjs } from "@/app/configuredDayJs";

// type AssignedInfluencerDetailsProps = {
//     events: TimelineEvent.Event[];
//     influencers: Influencer.InfluencerFull[];
//     setHighlightedEvent: Dispatch<SetStateAction<TimelineEvent.Event | undefined>>;
// };

// export default function AssignedInfluencerDetails(props: AssignedInfluencerDetailsProps) {
//     const { influencers, events, setHighlightedEvent } = props;
//     const [involvedInfluencers, setInvolvedInfluencers] = useState<Influencer.AssignedInfluencer[]>(
//         [],
//     );
//     useEffect(() => {
//         function getInfluencers() {
//             const involvedInfluencers: Influencer.AssignedInfluencer[] = [];

//             for (const event of events.filter((event) => !event.assignment.isPlaceholder)) {
//                 const influencer = influencers.find(
//                     (x) => x.id === event.assignment.influencer?.id,
//                 );
//                 if (!influencer) continue;
//                 const involvedInfluencer = involvedInfluencers.find((x) => x.id === influencer.id);
//                 switch (true) {
//                     case TimelineEvent.isInviteEvent(event): {
//                         if (!event.inviteEvent) continue;
//                         if (involvedInfluencer) {
//                             involvedInfluencer.inviteEvents.push(event);
//                         } else {
//                             involvedInfluencers.push({ ...influencer, inviteEvents: [event] });
//                         }
//                         break;
//                     }
//                     default:
//                         break;
//                 }
//             }
//             for (const influencer of involvedInfluencers) {
//                 influencer.inviteEvents.sort((a, b) =>
//                     a.date && b.date ? a.date.localeCompare(b.date) : 0,
//                 );
//             }
//             return involvedInfluencers;
//         }
//         setInvolvedInfluencers(getInfluencers());
//         return () => {};
//     }, [events, influencers]);
//     if (involvedInfluencers.length === 0) return null;
//     return (
//         <Accordion defaultExpanded disableGutters variant="outlined">
//             <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls="panel1-content"
//                 id="panel1-header"
//             >
//                 Zugewiesene Influencer
//             </AccordionSummary>
//             <AccordionDetails>
//                 {involvedInfluencers.map((influencer) => {
//                     // console.log(influencer);
//                     return (
//                         <Accordion key={influencer.id} variant="outlined">
//                             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                                 {influencer.firstName} {influencer.lastName}
//                             </AccordionSummary>
//                             <AccordionDetails>
//                                 {influencer.inviteEvents.length > 0 && (
//                                     <Accordion>
//                                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                                             Invites:{" "}
//                                             {influencer.inviteEvents.reduce(
//                                                 (sum: number, event) => {
//                                                     return sum + (event?.inviteEvent?.invites ?? 0);
//                                                 },
//                                                 0,
//                                             )}{" "}
//                                             verteilt über {influencer.inviteEvents.length} Termine
//                                         </AccordionSummary>
//                                         <AccordionDetails>
//                                             <Grid container>
//                                                 {influencer.inviteEvents.map((event) => {
//                                                     const date = dayjs(event.date);
//                                                     return (
//                                                         <Grid
//                                                             xs={12}
//                                                             key={event.id}
//                                                             onClick={() => {
//                                                                 setHighlightedEvent(event);
//                                                             }}
//                                                         >
//                                                             <Typography>
//                                                                 {date.format("DD.MM.YYYY")} (
//                                                                 {date.fromNow()})
//                                                             </Typography>
//                                                         </Grid>
//                                                     );
//                                                 })}
//                                             </Grid>
//                                         </AccordionDetails>
//                                     </Accordion>
//                                 )}
//                             </AccordionDetails>
//                         </Accordion>
//                     );
//                 })}
//             </AccordionDetails>
//         </Accordion>
//     );
// }
