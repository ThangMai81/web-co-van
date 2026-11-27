import { FACEBOOK_URL, YOUTUBE_URL } from "@/lib/social";

export function FloatingContact({ motionActive }: { motionActive: boolean }) {
  return (
    <div className="absolute left-6 top-[88px] z-40 flex flex-col items-center gap-4 md:top-[132px] lg:fixed lg:bottom-6 lg:left-auto lg:right-6 lg:top-auto">
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook Sunshine Center"
        className="group relative flex h-14 w-14 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-[#1877F2]/60 [animation:ping_2.5s_ease-out_infinite]" style={{ animationPlayState: motionActive ? "running" : "paused" }} />
        <span className="absolute inset-0 rounded-full bg-[#1877F2]/40 [animation:ping_2.5s_ease-out_infinite] [animation-delay:1.25s]" style={{ animationPlayState: motionActive ? "running" : "paused" }} />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] shadow-[-6px_10px_16px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
          <FacebookIcon className="h-7 w-7 text-white" />
        </span>
      </a>

      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kênh YouTube Sunshine Center"
        className="group relative flex h-14 w-14 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-[#FF0000]/50 [animation:ping_2.5s_ease-out_infinite]" style={{ animationPlayState: motionActive ? "running" : "paused" }} />
        <span className="absolute inset-0 rounded-full bg-[#FF0000]/30 [animation:ping_2.5s_ease-out_infinite] [animation-delay:1.25s]" style={{ animationPlayState: motionActive ? "running" : "paused" }} />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#FF0000] shadow-[-6px_10px_16px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
          <YoutubeIcon className="h-7 w-7 text-white" />
        </span>
      </a>
    </div>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21.5v-7.7h2.6l.4-3h-3V8.9c0-.87.25-1.46 1.5-1.46h1.6V4.76c-.28-.04-1.22-.12-2.32-.12-2.3 0-3.88 1.4-3.88 3.98v2.2H7.8v3h2.6v7.7h3.1Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8Z"
        fill="currentColor"
      />
      <path d="M10 15.2 15.2 12 10 8.8v6.4Z" fill="#FF0000" />
    </svg>
  );
}
