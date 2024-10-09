"use server";

import neatCsv from "neat-csv";

export async function parseCsvServer({ contents }: { contents: string }) {
    const parsed = await neatCsv(contents);
    console.log({ parsed });
    return parsed;
}
