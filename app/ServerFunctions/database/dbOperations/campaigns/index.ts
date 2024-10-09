//@index('./*', f => `import * as ${f.name} from '${f.path}'`)
import * as _config from "./_config";
import * as connect from "./connect";
import * as create from "./create";
import * as deleteItem from "./deleteItem";
import * as get from "./get";
import * as list from "./list";
import * as validate from "./validate";
//@endindex
export const campaign = {
    create: create.createNewCampaign,
    list: list.listCampaigns,
    listRef: list.listRef,
    get: get.getCampaign,
    getRef: get.getCampaignWithReferences,
    delete: deleteItem.deleteCampaign,
    deleteRef: deleteItem.deleteCampaignRef,
    connect: { toManager: connect.connectToManager },
};
