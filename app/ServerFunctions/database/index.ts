/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "./dbOperations/.database";
import { QueryClient } from "@tanstack/react-query";
import influencer from "./referenceResolvers/influencer";
import campaign from "./referenceResolvers/campaign";
import assignment from "./referenceResolvers/assignments";
import timelineEvent from "./referenceResolvers/timelineEvent";

const dataClient = {
    influencer,
    campaign,
    assignment,
    timelineEvent,
};

export default dataClient;
