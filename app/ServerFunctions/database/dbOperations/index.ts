import {
    createNewCampaign,
    deleteCampaign,
    dummyListCampaigns,
    getCampaign,
    listCampaigns,
} from "./campaigns";
import { createCustomer, deleteCustomer, updateCustomer } from "./customers";
import {
    createNewInfluencer,
    deleteInfluencer,
    getInfluencer,
    listInfluencers,
    updateInfluencer,
} from "./influencers";
import {
    createAssignment,
    deletePlaceholder,
    listAssignments,
    updateAssignment,
    getAssignment,
    listAssignmentsByCampaign,
} from "./assignments";
import {
    connectEvents,
    connectToAssignment,
    createTimelineEvent,
    deleteTimelineEvent,
    dummy,
    // getAssignmentTimelineEvents,
    getCampaignTimelineEvents,
    getTimelineEvent,
    listTimelineEvents,
    updateTimelineEvent,
    getAssignmentTimelineEvents,
} from "./timelineEvents";
import { createCandidate, deleteCandidate, publicProcessResponse } from "./candidate";
import {
    createEmailTrigger,
    deleteEmailTrigger,
    listEmailTriggers,
    updateEmailTrigger,
    getEmailTriggersForDateRange,
    getEmailTriggersForEvent,
} from "./emailTriggers";

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
    get: getInfluencer,
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
    listByAssignment: getAssignmentTimelineEvents,
    listByCampaign: getCampaignTimelineEvents,
    connectToAssignment: connectToAssignment,
    connectEvents: connectEvents,
};

export const assignments = {
    create: createAssignment,
    list: listAssignments,
    delete: deletePlaceholder,
    update: updateAssignment,
    get: getAssignment,
    listByCampaign: listAssignmentsByCampaign,
};

export const candidates = {
    create: createCandidate,
    delete: deleteCandidate,
    publicUpdate: publicProcessResponse,
};

export const emailTriggers = {
    create: createEmailTrigger,
    list: listEmailTriggers,
    update: updateEmailTrigger,
    delete: deleteEmailTrigger,
    byEvent: getEmailTriggersForEvent,
    byDateRange: getEmailTriggersForDateRange,
};

export const debug = {
    debugEventList: dummy,
    debugCampaignList: dummyListCampaigns,
};

const database = {
    campaign: campaigns,
    customer: customers,
    influencer: influencers,
    timelineEvent: timelineEvents,
    assignment: assignments,
    candidate: candidates,
    // staticEvent: staticEvents,
    emailTrigger: emailTriggers,
};

export default database;
