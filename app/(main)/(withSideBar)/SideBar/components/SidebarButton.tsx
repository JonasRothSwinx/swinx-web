import { sideBarButtonId } from "../config";
import { styles } from "@/app/(main)/styles/stylesExporter";

export interface ISideBarButton {
    id: sideBarButtonId;
    title: string;
    description: string;
    allowedGroups: string[];
    link?: string;
}
export function SideBarButton(props: {
    buttonProps: ISideBarButton;
    groups: string[];
    callback: (menu: sideBarButtonId) => unknown;
}) {
    const { id, title, description, allowedGroups } = props.buttonProps;
    const { groups, callback } = props;
    if (!allowedGroups.some((x) => groups.includes(x))) return null;

    return (
        <button
            id={id.toString()}
            className={styles.sideBarButton}
            onClick={() => callback(id)}
        >
            <h2>
                <span>&lt;-</span> {title}
            </h2>
            <p>{description}</p>
        </button>
    );
}
