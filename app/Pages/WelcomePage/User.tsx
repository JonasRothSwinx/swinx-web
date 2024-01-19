import { useAuthenticator } from "@aws-amplify/ui-react";
import { FetchUserAttributesOutput } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import { getUserAttributes, getUserGroups } from "../../ServerFunctions/serverActions";
import { Button } from "@mui/material";

function UserView() {
    const { user, signOut, authStatus } = useAuthenticator((context) => [
        context.user,
        context.authStatus,
    ]);
    const [attributes, setAttributes] = useState<FetchUserAttributesOutput>();
    const [groups, setGroups] = useState<string[]>([]);

    useEffect(() => {
        // debugger;
        getUserAttributes().then((result) => setAttributes(result));
        getUserGroups().then((result) => setGroups(result));

        return () => {
            setAttributes({});
            setGroups([]);
        };
    }, [user]);

    return (
        <>
            <div className={styles.user}>
                <h1>Hello {attributes?.given_name ?? ""}</h1>
                <Button
                    sx={{ background: "darkgray", color: "white" }}
                    variant="outlined"
                    onClick={signOut}
                >
                    Abmelden
                </Button>
                <span>
                    Gruppen:
                    <br />
                    {groups?.map((x) => x[0].toLocaleUpperCase() + x.slice(1)).join(", ")}
                </span>
            </div>
        </>
    );
}
export default UserView;
