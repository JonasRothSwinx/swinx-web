import influencer from "./dataClients/influencer";
import campaign from "./dataClients/campaignClient";
import assignment from "./dataClients/assignments";
import timelineEvent from "./dataClients/timelineEvent";
import candidate from "./dataClients/candidate";
import config from "./dataClients/config";
import customer from "./dataClients/customer";
import emailTriggerClient from "./dataClients/emailTrigger";

/**
 * Database Client for all data operations
 *
 */
const dataClient = {
    assignment,
    campaign,
    candidate,
    config,
    customer,
    emailTrigger: emailTriggerClient,
    influencer,
    timelineEvent,
};

export default dataClient;
