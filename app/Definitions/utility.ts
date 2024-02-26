export function range(n: number) {
    return Array.from({ length: n }, (value, key) => key);
}

export default { range };
