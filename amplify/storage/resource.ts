import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "swinxWebStorage",
    access: (allow) => ({
        "test/*": [allow.guest.to(["read", "write", "delete"])],
    }),
});
