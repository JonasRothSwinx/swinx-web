// import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
// import { DialogContent, TextField } from "@mui/material";
// import AudienceTargetFilter from "./AudienceTargetFilter";

// interface WebinarDetailsProps {
//     onChange: (data: Partial<TimelineEvent.Event>) => void;
//     event: Partial<TimelineEvent.Event>;
// }

// export default function WebinarDetails(props: WebinarDetailsProps): JSX.Element {
//     const { onChange, event } = props;

//     const EventHandlers = {
//         targetAudienceChange: (newData: Partial<TimelineEvent.Event["targetAudience"]>) => {
//             onChange({
//                 targetAudience: { ...{ industry: [], cities: [], country: [] }, ...event.targetAudience, ...newData },
//             });
//         },
//     };

//     return (
//         <DialogContent>
//             <TextField
//                 label="Webinartitel"
//                 fullWidth
//                 value={event.eventTitle ?? ""}
//                 onChange={(e) => onChange({ eventTitle: e.target.value })}
//             />
//             <TextField
//                 label="Anzahl Speaker"
//                 type="number"
//                 fullWidth
//                 value={event.eventAssignmentAmount ?? 1}
//                 onChange={(e) => onChange({ eventAssignmentAmount: Number(e.target.value) })}
//             />
//             {/* <AudienceTargetFilter event={event} onChange={EventHandlers.targetAudienceChange} /> */}
//         </DialogContent>
//     );
// }
