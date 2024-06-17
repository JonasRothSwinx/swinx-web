"use server";
import { InfluencerTaskEncodedData } from "@/app/utils/encodeQueryParams";

export default function decode(encodedData: string): InfluencerTaskEncodedData {
    return JSON.parse(atob(decodeURIComponent(encodedData)));
}
