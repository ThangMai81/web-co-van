"use client";

import type { ErrorInfo } from "next/error";
import DetailRouteUnavailable from "@/components/ui/DetailRouteUnavailable";

export default function ProgramDetailError({
  unstable_retry,
}: ErrorInfo) {
  return <DetailRouteUnavailable onRetry={unstable_retry} />;
}
