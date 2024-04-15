/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "./dbOperations/.database";
import { QueryClient } from "@tanstack/react-query";
import influencer from "./dataClients/influencer";
import campaign from "./dataClients/campaignClient";
import assignment from "./dataClients/assignments";
import timelineEvent from "./dataClients/timelineEvent";
import candidate from "./dataClients/candidate";
import config from "./dataClients/config";
import customer from "./dataClients/customer";

const dataClient = {
    assignment,
    campaign,
    candidate,
    config,
    customer,
    influencer,
    timelineEvent,
};

export default dataClient;
