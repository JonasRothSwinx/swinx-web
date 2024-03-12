import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
    const BASE_URL = process.env.BASE_URL;
    console.log("BASE_URL", BASE_URL);
    const response = await fetch(`${BASE_URL}/remindersTrigger`, {
        method: "GET",
    });
    console.log("response", response);
    return {
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
    };
};
