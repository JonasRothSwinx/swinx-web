interface PlaceholderProps {
    parentName: string;
    listItemName: string;
}
export default function PlaceholderList(props: PlaceholderProps) {
    return (
        <ul>
            {`{{#each ${props.parentName}}}`}
            <li>{`{{${props.listItemName}}}`}</li>
            {`{{/each}}`}
        </ul>
    );
}
