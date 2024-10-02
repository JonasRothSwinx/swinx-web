import { campaign } from "./campaigns";
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
    getCampaignTimelineEventsByIds,
} from "./timelineEvents";
import candidate from "./candidate";
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

const customers = {
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
    get: getCustomer,
    listByCampaign: listCustomersByCampaign,
};

const influencers = {
    get: getInfluencer,
    create: createNewInfluencer,
    list: listInfluencers,
    update: updateInfluencer,
    delete: deleteInfluencer,
};

const timelineEvents = {
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
    listByCampaignByIds: getCampaignTimelineEventsByIds,
};

const assignments = {
    create: assignmentOps.createAssignment,
    list: assignmentOps.listAssignments,
    delete: assignmentOps.deleteAssignment,
    update: assignmentOps.updateAssignment,
    get: assignmentOps.getAssignment,
    listByCampaign: assignmentOps.listAssignmentsByCampaign,
};

const candidates = {
    create: candidate.createCandidate,
    delete: candidate.deleteCandidate,
    update: candidate.updateCandidate,
    // publicUpdate: publicProcessResponse,
};

const emailTriggers = {
    create: createEmailTrigger,
    list: listEmailTriggers,
    update: updateEmailTrigger,
    delete: deleteEmailTrigger,
    byEvent: getEmailTriggersForEvent,
    byDateRange: getEmailTriggersForDateRange,
};

const projectManagers = {
    create: createProjectManager,
    get: getProjectManager,
    list: listProjectManagers,
    update: updateProjectManager,
    delete: deleteProjectManager,
    getByCognitoId: getProjectManagerByCognitoId,
};

const debug = {
    debugEventList: dummy,
    // debugCampaignList: dummyListCampaigns,
};

const database = {
    campaign,
    customer: customers,
    influencer: influencers,
    timelineEvent: timelineEvents,
    assignment: assignments,
    candidate: candidates,
    // staticEvent: staticEvents,
    emailTrigger: emailTriggers,
    projectManager: projectManagers,
};
export { database };
/**@deprecated Don't use the default export  */
export default database;
