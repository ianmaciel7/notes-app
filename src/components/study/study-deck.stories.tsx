import type { Story } from "@ladle/react";
import type { DueStudyQueueItemDto } from "@/data/study";
import { StudyDeck } from "./study-deck";

export default {
  title: "Components / Study / StudyDeck",
};

const sampleQueue: DueStudyQueueItemDto[] = [
  {
    questionId: "q-1",
    revisionId: "rev-1",
    prompt: "Which protocol operates at the Transport Layer of the OSI model?",
    isDue: true,
    stateVersion: 0,
    options: [
      { id: "opt-tcp", text: "Transmission Control Protocol (TCP)" },
      { id: "opt-ip", text: "Internet Protocol (IP)" },
      { id: "opt-http", text: "Hypertext Transfer Protocol (HTTP)" },
      { id: "opt-ethernet", text: "Ethernet" },
    ],
  },
  {
    questionId: "q-2",
    revisionId: "rev-2",
    prompt: "What is the primary purpose of an index in a database?",
    isDue: true,
    stateVersion: 2,
    options: [
      { id: "opt-perf", text: "To speed up data retrieval operations" },
      { id: "opt-sec", text: "To encrypt confidential data" },
      { id: "opt-norm", text: "To normalize relational tables" },
    ],
  },
];

export const WithDueCards: Story = () => (
  <div className="p-6">
    <StudyDeck spaceId="space-demo" initialQueue={sampleQueue} />
  </div>
);

export const EmptyQueue: Story = () => (
  <div className="p-6">
    <StudyDeck spaceId="space-demo" initialQueue={[]} />
  </div>
);
