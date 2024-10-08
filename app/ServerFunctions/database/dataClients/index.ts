"use client";
import { assignment } from "./assignments";
import { campaign } from "./campaign";
import { candidate } from "./candidate";
import { QueryClientConfig } from "./_config";
import { customer } from "./customer";
import { emailTrigger } from "./emailTrigger";
import { influencer } from "./influencer";
import { event } from "./events";
import { projectManager } from "./projectManager";

export const dataClient = {
    assignment,
    campaign,
    candidate,
    config: QueryClientConfig,
    customer,
    emailTrigger,
    influencer,
    event,
    projectManager,
};
