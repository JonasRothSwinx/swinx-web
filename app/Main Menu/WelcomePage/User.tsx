import { useAuthenticator } from "@aws-amplify/ui-react";
import { FetchUserAttributesOutput, fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { getUserAttributes, getUserGroups } from "../../ServerFunctions/serverActions";
import { Button, Typography } from "@mui/material";
import stylesExporter from "../styles/stylesExporter";
import { useQuery } from "@tanstack/react-query";
import { dataClient } from "@/app/ServerFunctions/database";
import ProjectManagerDialog from "../Dialogs/ProjectManagerDialog";

const styles = stylesExporter.user;

function UserView() {
    const { user, signOut, authStatus } = useAuthenticator((context) => [
        context.user,
        context.authStatus,
    ]);
    const attributes = useQuery({
        queryKey: ["userAttributes"],
        queryFn: async () => {
            // console.log("fetching attributes");
            const res = await getUserAttributes();
            // console.log("attributes fetched", res);
            return res;
        },
    });
    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: () => getUserGroups(),
        refetchOnWindowFocus: false,
    });
    const projectManagerEntry = useQuery({
        enabled:
            attributes.data !== undefined &&
            attributes.data.sub !== undefined &&
            userGroups.data &&
            ["projektmanager", "admin"].some((group) => userGroups.data.includes(group)),
        queryKey: ["projectManager"],
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
            <div className={styles.user}>
                <h1>Hello {attributes?.data.given_name ?? ""}</h1>
                <Button
                    sx={{ background: "darkgray", color: "white" }}
                    variant="outlined"
                    onClick={signOut}
                >
                    Abmelden
                </Button>
                <Typography variant="h6">Gruppen:</Typography>
                <Typography variant="body1">{userGroups?.data?.join(", ")}</Typography>
            </div>
        </>
    );
}
export default UserView;
