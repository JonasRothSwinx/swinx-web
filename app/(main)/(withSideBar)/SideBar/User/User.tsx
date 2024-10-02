import { useAuthenticator } from "@aws-amplify/ui-react";
import { FetchUserAttributesOutput, fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { getUserAttributes, getUserGroups } from "../../../../ServerFunctions/serverActions";
import { Box, Button, SxProps, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { dataClient } from "@dataClient";
import { ProjectManagerDialog } from "@/app/Components";
import { queryKeys } from "@/app/(main)/queryClient/keys";

export function UserView() {
    const { user, signOut, authStatus } = useAuthenticator((context) => [
        context.user,
        context.authStatus,
    ]);
    user.signInDetails?.loginId;
    const attributes = useQuery({
        queryKey: queryKeys.currentUser.userAttributes(),
        queryFn: async () => {
            // console.log("fetching attributes");
            const res = await getUserAttributes();
            // console.log("attributes fetched", res);
            return res;
        },
    });
    const userGroups = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
        queryFn: () => getUserGroups(),
        refetchOnWindowFocus: false,
    });
    const projectManagerEntry = useQuery({
        enabled:
            attributes.data !== undefined &&
            attributes.data.sub !== undefined &&
            userGroups.data &&
            ["projektmanager", "admin"].some((group) => userGroups.data.includes(group)),
        queryKey: queryKeys.currentUser.projectManager(),
        queryFn: async () => {
            // console.log("fetching project manager entry");
            const cognitoId = attributes.data?.sub;
            if (!cognitoId) {
                console.error("Cognito ID not found");
                return null;
            }
            const projectManager = await dataClient.projectManager.getByCognitoId({ cognitoId });
            // if (projectManager !== null) console.log("Project Manager Entry", projectManager);
            return projectManager;
        },
        refetchOnWindowFocus: false,
    });
    // getUserAttributes().then((res) => console.log(res));
    if (attributes.isLoading || userGroups.isLoading) return <div>Loading...</div>;
    if (attributes.isError || userGroups.isError)
        return <div>Error: {JSON.stringify(attributes.error ?? userGroups.error)}</div>;
    if (!attributes.data || !userGroups.data) return <div>Data not found</div>;
    if (!attributes.data.sub) return <div>Cognito Id ungültig</div>;

    const sx: SxProps = {
        "&": {
            alignSelf: "flex-start",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            right: 0,
            top: 0,
            width: "100%",
            "#Greeting": {
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "10px",
            },
        },
    };
    return (
        <>
            {projectManagerEntry.data === null && (
                <ProjectManagerDialog
                    firstName={attributes.data.given_name}
                    lastName={attributes.data.family_name}
                    email={attributes.data.email}
                    cognitoId={attributes.data.sub}
                />
            )}
            <Box
                id="UserSection"
                sx={sx}
            >
                <Typography id="Greeting">Hallo {attributes?.data.given_name ?? ""}</Typography>
                <Button
                    sx={{ background: "darkgray", color: "white" }}
                    variant="outlined"
                    onClick={signOut}
                >
                    Abmelden
                </Button>
                <Typography variant="h6">Gruppen:</Typography>
                <Typography variant="body1">{userGroups?.data?.join(", ") ?? "Keine"}</Typography>
            </Box>
        </>
    );
}
