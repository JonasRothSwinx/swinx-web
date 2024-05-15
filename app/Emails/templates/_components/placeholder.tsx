interface PlaceholderProps {
    name: string;
}
export default function Placeholder(props: PlaceholderProps) {
    return `{{${props.name}}}`;
}
