import { Box } from "@mui/material";
import { SideBar } from "./SideBar";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
            <>{children}</>
            <SideBar />
        </Box>
    );
}
