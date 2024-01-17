import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

export default { getUserGroups, getUserAttributes };

async function getUserGroups() {
    const session = await fetchAuthSession();
    const payloadGroups = session.tokens?.accessToken.payload["cognito:groups"] as string[];
    // console.log(typeof payloadGroups);
    // if (!payloadGroups || typeof payloadGroups !== Json[]) return [];
    console.log(payloadGroups);
    return payloadGroups;
}
async function getUserAttributes() {
    const attributes = await fetchUserAttributes();
    return attributes;
}
