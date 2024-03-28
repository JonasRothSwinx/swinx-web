import { createNewCampaign, deleteCampaign, getCampaign, listCampaigns } from "./campaigns";
import { createCustomer, deleteCustomer, updateCustomer } from "./customers";
import { createNewInfluencer, deleteInfluencer, listInfluencers, updateInfluencer } from "./influencers";
import {
    createAssignment,
    deletePlaceholder,
    listAssignments,
    updateAssignment,
    getAssignment,
    getAssignmentTimelineEvents,
} from "./assignments";
import {
    connectToAssignment,
    createTimelineEvent,
    deleteTimelineEvent,
    // getAssignmentTimelineEvents,
    getCampaignTimelineEvents,
    getTimelineEvent,
    listTimelineEvents,
    updateTimelineEvent,
} from "./timelineEvents";
import { createCandidate, deleteCandidate, publicProcessResponse } from "./candidate";
// import {
//     createNewStaticEvent,
//     getStaticEvent,
//     deleteStaticEvent,
//     listStaticEvents,
//     listStaticEventsByCampaign,
//     updateStaticEvent,
// } from "./database/staticEvent";

export const campaigns = {
    create: createNewCampaign,
    get: getCampaign,
    delete: deleteCampaign,
    list: listCampaigns,
};

export const customers = {
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
};

export const influencers = {
    create: createNewInfluencer,
    list: listInfluencers,
    update: updateInfluencer,
    delete: deleteInfluencer,
};

export const timelineEvents = {
    create: createTimelineEvent,
    get: getTimelineEvent,
    update: updateTimelineEvent,
    delete: deleteTimelineEvent,
    list: listTimelineEvents,
    // listByAssignment: getAssignmentTimelineEvents,
    listByCampaign: getCampaignTimelineEvents,
    connectToAssignment: connectToAssignment,
};

export const assignments = {
    create: createAssignment,
    list: listAssignments,
    delete: deletePlaceholder,
    update: updateAssignment,
    get: getAssignment,
    getTimelineEvents: getAssignmentTimelineEvents,
};

export const candidates = {
    create: createCandidate,
    delete: deleteCandidate,
    publicUpdate: publicProcessResponse,
};

// export const staticEvents = {
//     create: createNewStaticEvent,
//     get: getStaticEvent,
//     delete: deleteStaticEvent,
//     list: listStaticEvents,
//     listByCampaign: listStaticEventsByCampaign,
//     update: updateStaticEvent,
// };

const dbInterface = {
    campaign: campaigns,
    customer: customers,
    influencer: influencers,
    timelineEvent: timelineEvents,
    assignment: assignments,
    candidate: candidates,
    // staticEvent: staticEvents,
};

export default dbInterface;
