import { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Follower Analysis",
    description: "Bearbeite und filtere Follower-Exports von LinkedIn",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children};</>;
}
