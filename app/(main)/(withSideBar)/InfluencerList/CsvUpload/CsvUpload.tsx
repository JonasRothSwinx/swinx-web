import { Box, CircularProgress, TextField } from "@mui/material";
import { parseCsvServer } from "./parse";
import { dataClient } from "@/app/ServerFunctions/database/dataClients";
import { queryKeys } from "@/app/(main)/queryClient/keys";
import dotenv from "dotenv";
import { Influencers } from "@/app/ServerFunctions/types";
import { useState } from "react";
dotenv.config({ path: ".env.local" });

export default function CsvUpload() {
    const [isProcessing, setIsProcessing] = useState(false);
    return (
        <Box>
            <TextField
                disabled={isProcessing}
                id="FileUpload"
                label="Upload File"
                type="file"
                multiline={false}
                onChange={async ({ target }) => {
                    setIsProcessing(true);
                    if (!(target instanceof HTMLInputElement)) return;
                    const file = target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const contents = e.target?.result;
                        if (typeof contents !== "string") {
                            alert("File contents are not a string");
                            setIsProcessing(false);
                            return;
                        }
                        // console.log(contents);
                        // parseCsv({ csv: contents });
                        const parsed = await parseCsvServer({ contents });
                        await processParsedCsv({ parsed });
                        setIsProcessing(false);
                    };
                    reader.readAsText(file);
                }}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                    htmlInput: {
                        accept: ".csv",
                    },
                }}
            />
            {isProcessing && (
                <Box>
                    Processing...
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
}

interface ProcessParsedCsv {
    parsed: Record<string, string>[];
}
async function processParsedCsv({ parsed }: ProcessParsedCsv) {
    const queryClient = dataClient.config.getQueryClient();
    const influencers = queryClient.getQueryData<Influencers.Full[]>(queryKeys.influencer.all);
    if (!influencers) {
        console.log("No influencers found");
        return;
    }
    const categorized: { [key: string]: typeof parsed } = {};
    parsed.reduce((acc, item) => {
        const status = item["TL-Status"];
        if (!acc[status]) acc[status] = [];
        acc[status].push(item);
        return acc;
    }, categorized);
    const awsBranch = process.env.NEXT_PUBLIC_AWS_BRANCH;
    console.log({ awsBranch });
    console.log({ categorized });
    const closed = categorized["closed"];
    if (!closed) {
        console.log("No closed influencers found");
        return;
    }
    const influencerData = influencers;
    // return;
    await Promise.all(
        closed.map(async (item) => {
            const firstName = item["First Name"];
            const lastName = item["Last Name"];
            const email = item["Email"];
            const phoneNumber = item["Phone Number"];
            const topic = item["Thema"]?.split(",").map((t) => t.trim());
            const company = item["Company Name"];
            const companyPosition = item["Job Title"];

            if (!firstName || !lastName || !email) {
                console.log(`Missing required fields for influencer ${firstName} ${lastName}`);
                return;
            }
            if (influencerData.some((influencer) => influencer.email === email)) {
                console.log(`Influencer with email ${email} already exists`);
                return;
            }

            return dataClient.influencer.create({
                firstName,
                lastName,
                email: awsBranch === "samndbox" ? "jonasroth1@gmail.com" : email,
                phoneNumber: phoneNumber === "" ? undefined : phoneNumber,
                topic: topic ?? [],
                company: company === "" ? undefined : company,
                companyPosition: companyPosition === "" ? undefined : companyPosition,
                notes: "",
                industry: "",
            });
        }),
    );
    queryClient.invalidateQueries({ queryKey: queryKeys.influencer.all });
}
