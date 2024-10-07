import { queryKeys } from "./keys";

export const query = {
    keys: queryKeys,
};

class Queries {
    public static keys: typeof queryKeys;
    private static instance: Queries;

    constructor() {
        if (Queries.instance) {
            return Queries.instance;
        }
        Queries.keys = queryKeys;
    }
}
