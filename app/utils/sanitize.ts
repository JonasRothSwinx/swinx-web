export default function sanitize<T>(input: T): T {
    return JSON.parse(JSON.stringify(input));
}
