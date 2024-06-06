import oldFilter from "./Follower Filter - Ergebnis 3.csv";
import newFilter from "./Neuer Filter Krentz (1).csv";
import Krentz2 from "./Krentz2 - Ergebnis.csv";

import * as CSV from "csv-string";

type CSVRow = {
    [key: string]: string;
};
type CSVObject = CSVRow[];

export default function filterCSV() {
    const [originalCsv, remainingCsv, newCsv] = [oldFilter, newFilter, Krentz2].map(loadCSV);
    console.log({ originalCsv, remainingCsv, newCsv });
    const processedCsv = applyBlacklist(originalCsv, remainingCsv);
    console.log({ processedCsv });
    const newUnprocessed = applyBlacklist(newCsv, processedCsv);
    console.log({ newUnprocessed });
    makeNewFilterCsv({ filterData: newUnprocessed });
}

function loadCSV(file: string): CSVObject {
    const csv = CSV.parse(file, { output: "objects" });
    // console.log(csv);
    return csv;
}

function applyBlacklist(file: CSVObject, blacklistFile: CSVObject) {
    const filtered = file.filter((row) => {
        const firstName = row["First Name"];
        const lastName = row["Last Name"];
        const company = row["Company"];
        const isBlacklisted = blacklistFile.some((blacklistRow) => {
            const isHit =
                blacklistRow["First Name"] === firstName &&
                blacklistRow["Last Name"] === lastName &&
                blacklistRow["Company"] === company;
            if (isHit) {
                // console.log(firstName, lastName, company);
            }
            return isHit;
        });
        return !isBlacklisted;
    });
    return filtered;
}
interface MakeNewFilterCsvParams {
    filterData: CSVObject;
}
function makeNewFilterCsv({ filterData }: MakeNewFilterCsvParams) {
    const firstEntry = filterData[0];
    const headers = Object.keys(firstEntry).join(",");
    const data = filterData.map((row) =>
        Object.values(row)
            .map((value) => `"${value}"`)
            .join(","),
    );
    const csv = [headers, ...data].join("\n");
    const blob = makeBlob({ csv });
    console.log({ blob });
    downloadBlob({ blob, name: "Neuer Filter.csv" });
}

function makeBlob({ csv }: { csv: string }) {
    const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
    return new Blob([BOM, csv], { type: "text/csv;charset=utf8" });
}

function downloadBlob({ blob, name }: { blob: Blob; name: string }) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
}
