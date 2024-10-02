//@index('./*', f => `import * as ${f.name} from '${f.path}'`)
import * as create from "./create";
import * as deleteItem from "./deleteItem";
import * as get from "./get";
import * as list from "./list";
//@endindex

export const campaign = {
    create: create.createCampaign,
    delete: deleteItem.deleteCampaign,
    get: get.getCampaign,
    getRef: get.getCampaignWithIds,
    list: list.listCampaigns,
    listRef: list.listRef,
};
