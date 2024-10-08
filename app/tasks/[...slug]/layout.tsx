import { Metadata } from "next";
import { configureAmplifyServer } from "./ConfigureAmplifyServer";
import React from "react";

export const metadata: Metadata = {
    title: "Swinx Aufgabenübersicht",
    description: "Ihre Aufgaben im Überblick",
};

configureAmplifyServer();

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
