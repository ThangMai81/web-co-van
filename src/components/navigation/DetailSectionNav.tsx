type DetailSectionNavItem = {
  id: string;
  label: string;
};

export function DetailSectionNav({
  items,
  label,
}: {
  items: DetailSectionNavItem[];
  label: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className="mt-6 border-y border-blue/10 py-2"
    >
      <ul className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain px-1 py-1">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="inline-flex min-h-10 items-center rounded-full border border-blue/15 bg-white px-4 py-2 text-sm font-bold text-blue transition-colors hover:border-yellow hover:bg-yellow/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
