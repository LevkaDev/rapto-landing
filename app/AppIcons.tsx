// App icons shared by the landing page demos.

export type SwitcherApp = "tradingview" | "safari" | "telegram" | "terminal" | "vscode" | "notes" | "mail" | "music" | "files";

export function SwitcherAppIcon({ app, size = 18 }: { app: SwitcherApp; size?: number }) {
  switch (app) {
    case "tradingview":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5.5" fill="#000" />
          <g transform="translate(3.6 3.6) scale(0.7)">
            <path
              fill="#fff"
              d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.354 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z"
            />
          </g>
        </svg>
      );
    case "telegram":
      return (
        <svg width={size} height={size} viewBox="0 0 240 240" aria-hidden>
          <defs>
            <linearGradient id="switcher-tg" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#2AABEE" />
              <stop offset="1" stopColor="#229ED9" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="120" fill="url(#switcher-tg)" />
          <path
            fill="#fff"
            d="M54.3 118.8c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.3-16.3 44.8-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3s.4 3.1.2 4.7c-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.9 11.4-50.6 33.5-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.7-4.4-7.5-2.4-13.5-3.7-13-7.9.3-2.2 3.3-4.4 8.9-6.7z"
          />
        </svg>
      );
    case "vscode":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#2F9AF2"
            d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
          />
        </svg>
      );
    case "safari":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="switcher-safari" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#1AD6FD" />
              <stop offset="1" stopColor="#1D62F0" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5.5" fill="#fff" />
          <circle cx="12" cy="12" r="10" fill="url(#switcher-safari)" />
          <g stroke="#fff" strokeOpacity="0.7" strokeWidth="0.6">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="12" y1="2.8" x2="12" y2="4" transform={`rotate(${i * 30} 12 12)`} />
            ))}
          </g>
          <g transform="rotate(45 12 12)">
            <path d="M12 4.5 L14 12 L10 12 Z" fill="#FF3B30" />
            <path d="M12 19.5 L10 12 L14 12 Z" fill="#fff" />
          </g>
        </svg>
      );
    case "terminal":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" fill="#D9D9DE" />
          <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="#1C1C1E" />
          <path d="M6 8.5 L9.5 11.5 L6 14.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 15 H16.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "mail":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="switcher-mail" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#5AC8FA" />
              <stop offset="1" stopColor="#1D7CF2" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5.5" fill="url(#switcher-mail)" />
          <rect x="4.5" y="7" width="15" height="10" rx="1.6" fill="#fff" />
          <path d="M5 8 L12 13 L19 8" fill="none" stroke="#1D7CF2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "music":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="switcher-music" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#FF5E7A" />
              <stop offset="1" stopColor="#FA233B" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5.5" fill="url(#switcher-music)" />
          <path d="M10 7.2 L16.5 5.8 V14.6" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 7.2 V16" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="8.4" cy="16.2" rx="2" ry="1.6" fill="#fff" />
          <ellipse cx="14.9" cy="14.8" rx="2" ry="1.6" fill="#fff" />
        </svg>
      );
    case "files":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5.5" fill="#EAF3FF" />
          <path d="M4.5 8.2 a1.4 1.4 0 0 1 1.4 -1.4 h3.6 l1.5 1.6 h7.1 a1.4 1.4 0 0 1 1.4 1.4 v6.6 a1.4 1.4 0 0 1 -1.4 1.4 h-12.2 a1.4 1.4 0 0 1 -1.4 -1.4 z" fill="#3B9BFF" />
          <path d="M4.5 10.4 h15 v6 a1.4 1.4 0 0 1 -1.4 1.4 h-12.2 a1.4 1.4 0 0 1 -1.4 -1.4 z" fill="#69B7FF" />
        </svg>
      );
    case "notes":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <clipPath id="switcher-notes">
            <rect width="24" height="24" rx="5.5" />
          </clipPath>
          <g clipPath="url(#switcher-notes)">
            <rect width="24" height="24" fill="#FFFFFF" />
            <rect width="24" height="7" fill="#FFCC33" />
            <g stroke="#C7C7CC" strokeWidth="0.8">
              <line x1="3" y1="11" x2="21" y2="11" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="3" y1="19" x2="21" y2="19" />
            </g>
          </g>
        </svg>
      );
  }
}
