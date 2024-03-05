import { createNewCampaign, deleteCampaign, getCampaign, listCampaigns } from "./database/campaigns";
import { createCustomer, deleteCustomer, updateCustomer } from "./database/customers";
import { createNewInfluencer, deleteInfluencer, listInfluencers, updateInfluencer } from "./database/influencers";
import { createAssignment, deletePlaceholder, updateAssignment } from "./database/assignments";
import {
    createTimelineEvent,
    deleteTimelineEvent,
    listTimelineEvents,
    updateTimelineEvent,
} from "./database/timelineEvents";
import { createCandidate, deleteCandidate, publicProcessResponse } from "./database/candidate";

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
    update: updateTimelineEvent,
    delete: deleteTimelineEvent,
    list: listTimelineEvents,
};

export const assignments = {
    create: createAssignment,
    delete: deletePlaceholder,
    update: updateAssignment,
};

export const candidates = {
    create: createCandidate,
    delete: deleteCandidate,
    publicUpdate: publicProcessResponse,
};

const dbInterface = {
    campaign: campaigns,
    customer: customers,
    influencer: influencers,
    timelineEvent: timelineEvents,
    assignment: assignments,
    candidate: candidates,
};

export default dbInterface;
