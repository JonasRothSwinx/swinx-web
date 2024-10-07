//@index('./*', f => `import * as ${f.name} from '${f.path}'`)
import * as create from "./create";
import * as deleteItem from "./deleteItem";
import * as get from "./get";
import * as list from "./list";
import * as update from "./update";
//@endindex

export const event = {
    create: create.createTimelineEvent,
    update: update.updateTimelineEvent,
    delete: deleteItem.deleteTimelineEvent,
    get: get.getTimelineEvent,
    list: {
        all: list.listAll,
        by: {
            assignment: list.listByAssignment,
            campaign: list.listByCampaign,
            campaignAndIds: list.listByCampaignByIds,
        },
    },
};
