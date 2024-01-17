import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import util from "../../util";
import { Subscription } from "rxjs";

const client = generateClient<Schema>();

async function deleteInfluencer(todo: Schema["InfluencerPublic"]) {
    // console.log(client);
    const response = await client.models.InfluencerPublic.delete({ id: todo.id });
    console.log({ response });
}

function InfluencerList(props: {}) {
    const [influencer, setInfluencer] = useState<Schema["InfluencerPublic"][]>([]);
    const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    const [groups, setGroups] = useState<string[]>([]);
    // const { tokens } =
    useEffect(() => {
        console.log("subscribing to updates");
        let sub: Subscription;
        try {
            if (authStatus !== "authenticated") return;
            sub = client.models.InfluencerPublic?.observeQuery().subscribe(async ({ items }) => {
                console.log(items);
                const details = await Promise.all(items.map((x) => x.details()));
                console.log(details);
                // setDetails([...details]);
                setInfluencer([...items]);
            });
            console.log(sub);
        } catch (error) {
            console.log("error", error);
        }

        return () => sub?.unsubscribe();
    }, [client]);

    useEffect(() => {
        util.getUserGroups().then((result) => setGroups(result));
        return () => {};
    }, [user]);

    if (influencer.length === 0) return <span>Keine Influenzerdaten vorhanden</span>;
    return (
        <ul>
            <span>Groups: {groups}</span>
            {influencer.map((influencer, idx) => (
                <li key={influencer.id}>
                    {influencer.firstName} {influencer.lastName} {/* {details[idx].email ?? ""} */}
                    {
                        /* groups.includes("admin") &&  */ <button onClick={() => deleteInfluencer(influencer)}>
                            Löschen
                        </button>
                    }
                </li>
            ))}
        </ul>
    );
}

export default InfluencerList;
