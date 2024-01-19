import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { getUserAttributes, getUserGroups } from "./ServerFunctions/serverActions";
import { Subscription } from "rxjs";

const client = generateClient<Schema>();

async function deleteTodo(todo: Schema["Todo"]) {
    console.log(client);
    const response = await client.models.Todo.delete({ id: todo.id });
    console.log(response);
}

function TodosList(props: {}) {
    const [todos, setTodos] = useState<Schema["Todo"][]>([]);
    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    const [groups, setGroups] = useState<string[]>([]);
    // const { tokens } =
    useEffect(() => {
        console.log("subscribing to updates");
        let sub: Subscription;
        try {
            if (authStatus !== "authenticated") return;
            sub = client.models.Todo?.observeQuery().subscribe(({ items }) => {
                console.log(items);
                setTodos([...items]);
            });
            console.log(sub);
        } catch (error) {
            console.log("error", error);
        }

        return () => sub?.unsubscribe();
    }, [client]);

    useEffect(() => {
        getUserGroups().then((result) => setGroups(result));
        return () => {};
    }, [user]);

    if (todos.length === 0) return <span>No Todos found</span>;
    return (
        <ul>
            <span>Groups: {groups}</span>
            {todos.map((todo) => (
                <li key={todo.id}>
                    {todo.content}
                    {(todo.owner === user.userId || groups.includes("admin")) && (
                        <button onClick={() => deleteTodo(todo)}>Delete</button>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default TodosList;
