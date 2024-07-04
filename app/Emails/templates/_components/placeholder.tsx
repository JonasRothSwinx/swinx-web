interface PlaceholderProps {
    name: string;
    isOptional?: boolean;
}
export default function Placeholder({ name, isOptional }: PlaceholderProps) {
    if (isOptional) {
        return `{{#if ${name}}}{{${name}?}}{{/if}}`;
    }
    return `{{${name}}}`;
}
