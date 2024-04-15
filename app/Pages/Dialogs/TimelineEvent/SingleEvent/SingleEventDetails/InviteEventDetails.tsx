// import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
// import { DialogContent, TextField } from "@mui/material";

// interface WebinarDetailsProps {
//     onChange: (data: Partial<TimelineEvent.Invites>) => void;
//     data: Partial<TimelineEvent.Invites>;
// }

// export default function InviteDetails(props: WebinarDetailsProps): JSX.Element {
//     const { onChange, data } = props;

//     const EventHandlers = {};

//     return (
//         <DialogContent>
//             <TextField
//                 label="Anzahl Invites"
//                 type="number"
//                 fullWidth
//                 value={data.eventTaskAmount ?? 1}
//                 onChange={(e) => onChange({ eventTaskAmount: Number(e.target.value) })}
//             />
//         </DialogContent>
//     );
// }
