"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@/lib/icons";

export default function CourseSearchInput({
  category,
  sort,
  search,
}: {
  category?: string;
  sort?: string;
  search?: string;
}) {
  const [value, setValue] = useState(search || "");
  const router = useRouter();

  function handleSearch() {
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (sort) query.set("sort", sort);
    if (value.trim()) query.set("search", value.trim());
    const qs = query.toString();
    router.push(qs ? `/courses?${qs}` : "/courses", { scroll: false });
  }

  return (
    <div className="flex min-h-11 min-w-0 w-full items-center gap-2 rounded-full border-2 border-blue/20 bg-white px-4 py-2 focus-within:border-blue focus-within:ring-2 focus-within:ring-yellow focus-within:ring-offset-2 focus-within:ring-offset-white lg:w-auto">
      <Search size={16} className="shrink-0 text-blue/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Tìm khóa học..."
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-blue outline-none placeholder:text-blue/40 sm:w-auto sm:flex-1 lg:w-52 lg:flex-none"
      />
    </div>
  );
}
