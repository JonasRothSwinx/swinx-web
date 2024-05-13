import influencer from "./dataClients/influencer";
import campaign from "./dataClients/campaign";
import assignment from "./dataClients/assignments";
import timelineEvent from "./dataClients/timelineEvent";
import candidate from "./dataClients/candidate";
import config from "./dataClients/config";
import customer from "./dataClients/customer";
import emailTrigger from "./dataClients/emailTrigger";
import projectManagerClient from "./dataClients/projectManager";

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
    emailTrigger,
    influencer,
    timelineEvent,
    projectManager: projectManagerClient,
};

export default dataClient;
