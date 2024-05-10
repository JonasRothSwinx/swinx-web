import { Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplify_outputs.json";
import { cookies } from "next/headers";

const client = generateServerClientUsingCookies<Schema>({ config, cookies });

export default client;
