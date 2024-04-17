import { useQuery } from "@tanstack/react-query";
import CampaignList from "./CampaignList";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function CampaignMenu(props: {}) {
    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: async () => {
            const userGroups = await getUserGroups();
            return userGroups;
        },
        refetchOnWindowFocus: false,
        placeholderData: [],
    });
    if (userGroups.isLoading)
        return (
            <Box
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                Loading...
                <br />
                <CircularProgress />
            </Box>
        );
    if (userGroups.isError)
        return (
            <Box
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                Error... {JSON.stringify(userGroups.error)}
            </Box>
        );
    if (
        userGroups.data &&
        !["admin", "projektmanager"].some((group) => userGroups.data.includes(group))
    ) {
        return (
            <Box
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                <Typography variant="h6">Sie haben keine Berechtigung für diese Seite</Typography>
            </Box>
        );
    }
    return (
        <>
            {/* <span>Kampagnen</span> */}
            <CampaignList />
        </>
    );
}
