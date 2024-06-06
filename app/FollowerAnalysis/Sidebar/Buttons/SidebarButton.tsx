import { Box, SxProps } from "@mui/material";
import Link from "next/link";

// export class SidebarButton extends React.Component {
//     readonly linkTo: string;
//     readonly displayText?: string;
//     constructor(linkTo: string, displayText?: string) {
//         this.linkTo = linkTo;
//         this.displayText = displayText ?? linkTo;
//     }
//     style: SxProps = {
//         "&": {
//             display: "flex",
//             flexDirection: "column",
//             /* justifyContent: "space-between", */
//             width: "100%",
//             padding: "1rem 0.2rem",
//             borderRadius: "var(--border-radius)",
//             background: "rgba(var(--card-rgb), 0)",
//             border: "1px solid rgba(var(--card-border-rgb), 0)",
//             transition: "background 200ms, border 200ms, box-shadow 200ms",
//             cursor: "pointer",
//         },
//     };
//     render(): JSX.Element {
//         return (
//             <Box sx={this.style}>
//                 <Link href={this.linkTo}></Link>;
//             </Box>
//         );
//     }
// }
