import { Suspense } from "react";
import { CompareWorkspace } from "@/components/compare-workspace";

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareWorkspace />
    </Suspense>
  );
}
