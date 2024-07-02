import { Candidate, Customer, ProjectManager } from "@/app/ServerFunctions/types";

interface SendDecisionNotification {
    acceptedCandidate: Candidate;
    rejectedCandidates: Candidate[];
    projectManagers: ProjectManager[];
    customer: Customer;
}
export function sendDecisionNotification({
    acceptedCandidate,
    rejectedCandidates,
    projectManagers,
    customer,
}: SendDecisionNotification) {}
