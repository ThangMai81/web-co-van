export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-4">
      <a
        href="https://zalo.me/0935626186"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn tin qua Zalo"
        className="group relative flex h-14 w-14 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-blue-600/60 [animation:ping_2.5s_ease-out_infinite]" />
        <span className="absolute inset-0 rounded-full bg-blue-600/40 [animation:ping_2.5s_ease-out_infinite] [animation-delay:1.25s]" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-[-6px_10px_16px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
          <ZaloIcon className="h-full w-full p-1.5 text-white" />
        </span>
      </a>

      <a
        href="https://m.me/sunshinecenter"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn tin qua Messenger"
        className="group relative flex h-14 w-14 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-blue-400/60 [animation:ping_2.5s_ease-out_infinite]" />
        <span className="absolute inset-0 rounded-full bg-blue-400/40 [animation:ping_2.5s_ease-out_infinite] [animation-delay:1.25s]" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00B2FF] via-[#2E5EFF] to-[#B026FF] shadow-[-6px_10px_16px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
          <MessengerIcon className="h-7 w-7 text-white" />
        </span>
      </a>
    </div>
  );
}

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 1.5C5.7 1.5 1 5.85 1 11.2c0 3.1 1.6 5.9 4.15 7.7-.13 1.05-.5 2.4-1.13 3.6a.4.4 0 0 0 .5.55c1.65-.55 3.1-1.25 4.05-1.8A13 13 0 0 0 12 21.9c6.3 0 11-4.85 11-10.7S18.3 1.5 12 1.5Z"
        fill="currentColor"
      />
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        fill="#1D4ED8"
        fontFamily="Arial, sans-serif"
      >
        Zalo
      </text>
    </svg>
  );
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C6.48 2 2 6.15 2 11.25c0 2.9 1.44 5.49 3.7 7.19V22l3.38-1.86c.9.25 1.87.39 2.92.39 5.52 0 10-4.15 10-9.28S17.52 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M6.5 13.87l3.4-3.6 3.28 2.53 3.32-3.6-3.4 3.6-3.28-2.53-3.32 3.6Z"
        fill="#4267FF"
      />
    </svg>
  );
}
