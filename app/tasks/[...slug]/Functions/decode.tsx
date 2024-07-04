"use server";
import { InfluencerTaskEncodedData } from "@/app/utils";

export default function decode(encodedData: string): InfluencerTaskEncodedData {
    return JSON.parse(atob(decodeURIComponent(encodedData)));
}
