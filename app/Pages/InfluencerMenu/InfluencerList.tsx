import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import util from "../../util";
import { Subscription } from "rxjs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const client = generateClient<Schema>();

async function deleteInfluencer(todo: Schema["InfluencerPublic"]) {
    // console.log(client);
    const response = await client.models.InfluencerPublic.delete({ id: todo.id });
    console.log({ response });
}
const columns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 100,
        flex: 1,
    },
    {
        field: "firstName",
        headerName: "Vorname",
        flex: 2,
        headerAlign: "center",
        align: "center",
    },
    {
        field: "lastName",
        headerName: "Nachname",
        flex: 2,

        headerAlign: "center",
        align: "center",
    },
    {
        field: "email",
        headerName: "E-Mail",
        flex: 3,

        headerAlign: "center",
        align: "center",
    },
];
function InfluencerList(props: {}) {
    const [influencer, setInfluencer] = useState<Schema["InfluencerPublic"][]>([]);
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const [data, setData] = useState<(Schema["InfluencerPrivate"] & Schema["InfluencerPublic"])[]>(
        [],
    );

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
                const details = await Promise.all(
                    items.map(async (x) => {
                        const { data: details } = await x.details();
                        const influencer = { ...x, ...details };
                        return influencer;
                    }),
                );
                console.log(details);
                setData([...details]);
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
        <DataGrid
            rows={data}
            columns={columns}
            autoHeight={true}
            sx={{
                m: 2,
                background: "lightgray",
                "& .MuiDataGrid-cell": {
                    // color: "primary.main",
                    borderLeft: "1px solid black",
                },
                "& .MuiDataGrid-cell:first-child": {
                    // color: "primary.main",
                    borderLeft: "none",
                },
            }}
        />
    );
    // return (
    //     <ul>
    //         <span>Groups: {groups}</span>
    //         {influencer.map((influencer, idx) => (
    //             <li key={influencer.id}>
    //                 {influencer.firstName} {influencer.lastName} {/* {details[idx].email ?? ""} */}
    //                 {
    //                     /* groups.includes("admin") &&  */ <button onClick={() => deleteInfluencer(influencer)}>
    //                         Löschen
    //                     </button>
    //                 }
    //             </li>
    //         ))}
    //     </ul>
    // );
}

export default InfluencerList;
