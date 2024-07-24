import { Box, Button, SxProps } from "@mui/material";

interface ControlsProps {
    path: string;
}
export function Controls({ path }: ControlsProps) {
    const sx: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "10px",
        },
    };
    return (
        <Box>
            <Button onClick={() => console.log("Download", path)}>Download</Button>
            <Button onClick={() => console.log("Delete", path)}>Delete</Button>
        </Box>
    );
}
