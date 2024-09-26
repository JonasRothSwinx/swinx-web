//@index('./**.css', f => `import ${f.name.replace(/\.module/,"")} from '${f.path}.css'`)
import animations from "./css/animations.module.css";
import campaignDetails from "./css/campaignDetails.module.css";
import dialogs from "./css/dialogs.module.css";
import general from "./css/general.module.css";
import sharedStyles from "./css/sharedStyles.module.css";
import sideBar from "./css/sideBar.module.css";
import timeline from "./css/timeline.module.css";
import user from "./css/user.module.css";
import welcomePage from "./css/welcomePage.module.css";
//@endindex

export { campaignDetails, dialogs, general, sideBar, timeline, user, welcomePage };
const stylesExporter = {
    campaignDetails,
    dialogs,
    general,
    sideBar,
    timeline,
    user,
    welcomePage,
};
export const styles = {
    //@index('./**.css', f => `...${f.name.replace(/\.module/,"")},`)
    ...animations,
    ...campaignDetails,
    ...dialogs,
    ...general,
    ...sharedStyles,
    ...sideBar,
    ...timeline,
    ...user,
    ...welcomePage,
    //@endindex
};

export default stylesExporter;
