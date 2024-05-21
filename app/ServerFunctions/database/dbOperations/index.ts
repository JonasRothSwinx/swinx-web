import {
    createNewCampaign,
    deleteCampaign,
    dummyListCampaigns,
    getCampaign,
    listCampaigns,
} from "./campaigns";
import {
    createCustomer,
    deleteCustomer,
    getCustomer,
    listCustomersByCampaign,
    updateCustomer,
} from "./customers";
import {
    createNewInfluencer,
    deleteInfluencer,
    getInfluencer,
    listInfluencers,
    updateInfluencer,
} from "./influencers";
import * as assignmentOps from "./assignments";
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
    getEventForEmailTrigger,
} from "./timelineEvents";
import { createCandidate, deleteCandidate } from "./candidate";
import {
    createEmailTrigger,
    deleteEmailTrigger,
    listEmailTriggers,
    updateEmailTrigger,
    getEmailTriggersForDateRange,
    getEmailTriggersForEvent,
} from "./emailTriggers";

import {
    createProjectManager,
    deleteProjectManager,
    getProjectManager,
    getProjectManagerByCognitoId,
    listProjectManagers,
    updateProjectManager,
} from "./projectManagers";

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
    get: getCustomer,
    listByCampaign: listCustomersByCampaign,
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
    getForEmailTrigger: getEventForEmailTrigger,
};

export const assignments = {
    create: assignmentOps.createAssignment,
    list: assignmentOps.listAssignments,
    delete: assignmentOps.deletePlaceholder,
    update: assignmentOps.updateAssignment,
    get: assignmentOps.getAssignment,
    listByCampaign: assignmentOps.listAssignmentsByCampaign,
};

export const candidates = {
    create: createCandidate,
    delete: deleteCandidate,
    // publicUpdate: publicProcessResponse,
};

export const emailTriggers = {
    create: createEmailTrigger,
    list: listEmailTriggers,
    update: updateEmailTrigger,
    delete: deleteEmailTrigger,
    byEvent: getEmailTriggersForEvent,
    byDateRange: getEmailTriggersForDateRange,
};

export const projectManagers = {
    create: createProjectManager,
    get: getProjectManager,
    list: listProjectManagers,
    update: updateProjectManager,
    delete: deleteProjectManager,
    getByCognitoId: getProjectManagerByCognitoId,
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
    projectManager: projectManagers,
};

export default database;
