"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function DetailRouteScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
