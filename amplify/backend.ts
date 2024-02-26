import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
// import * as ses from "aws-cdk-lib/aws-ses";

const backend = defineBackend({
    auth,
    data,
});

// const resourceStack = backend.createStack("ResourceStack")

// ses.
