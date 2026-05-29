import { Suspense } from "react";
import { DiscussionBoard } from "@/components/discussion-board";

export default function DiscussionsPage() {
  return (
    <Suspense fallback={null}>
      <DiscussionBoard />
    </Suspense>
  );
}
