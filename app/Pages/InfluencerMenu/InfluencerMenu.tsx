"use client";
import InfluencerList from "./InfluencerList";

import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
function InfluencerMenu() {
    return <InfluencerList />;
}

export default InfluencerMenu;
