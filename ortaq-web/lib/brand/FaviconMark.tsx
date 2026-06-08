import {
  faviconFrame,
  getFaviconPalette,
  type FaviconDirection,
  type FaviconTheme,
  PRODUCTION_FAVICON_DIRECTION,
} from "@/lib/brand/faviconMarks";

type FaviconMarkProps = {
  direction?: FaviconDirection;
  theme?: FaviconTheme;
  size?: number;
  framed?: boolean;
  className?: string;
};

function OperationsPaths({ p }: { p: ReturnType<typeof getFaviconPalette> }) {
  return (
    <>
      <circle cx="8" cy="11" r="2.25" fill={p.accent} />
      <line x1="11.5" y1="11" x2="24" y2="11" stroke={p.primary} strokeWidth="2.25" strokeLinecap="round" />
      <line x1="10" y1="16" x2="22" y2="16" stroke={p.secondary} strokeWidth="2" strokeLinecap="round" opacity={0.72} />
      <line x1="10" y1="21" x2="20" y2="21" stroke={p.secondary} strokeWidth="2" strokeLinecap="round" opacity={0.48} />
    </>
  );
}

function MonitoringPaths({ p }: { p: ReturnType<typeof getFaviconPalette> }) {
  return (
    <>
      <rect x="9" y="8" width="14" height="16" rx="1.5" stroke={p.primary} strokeWidth="1.75" fill="none" />
      <line x1="12" y1="12.5" x2="20" y2="12.5" stroke={p.secondary} strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
      <path d="M11 15.2 L12.4 16.6 L15.8 13.2" stroke={p.accent} strokeWidth="1.6" strokeLinecap="square" fill="none" />
      <line x1="17" y1="15.4" x2="20" y2="15.4" stroke={p.primary} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 19.2 L12.4 20.6 L15.8 17.2" stroke={p.muted} strokeWidth="1.6" strokeLinecap="square" fill="none" opacity={0.75} />
      <line x1="17" y1="19.4" x2="19" y2="19.4" stroke={p.secondary} strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
    </>
  );
}

function VisibilityPaths({ p }: { p: ReturnType<typeof getFaviconPalette> }) {
  return (
    <>
      <rect x="8" y="9" width="16" height="14" rx="2" stroke={p.primary} strokeWidth="1.5" fill="none" />
      <rect x="10" y="12" width="10" height="2.25" rx="0.5" fill={p.accent} />
      <rect x="10" y="16" width="12" height="2" rx="0.5" fill={p.primary} opacity={0.85} />
      <rect x="10" y="19.75" width="8" height="2" rx="0.5" fill={p.secondary} opacity={0.55} />
    </>
  );
}

function WordmarkPaths({ p }: { p: ReturnType<typeof getFaviconPalette> }) {
  return (
    <>
      <path d="M19.5 10.5 A7.5 7.5 0 1 1 11 19" stroke={p.primary} strokeWidth="3" strokeLinecap="butt" fill="none" />
      <path d="M11.5 21 A7.5 7.5 0 0 1 20.5 21" stroke={p.accent} strokeWidth="3" strokeLinecap="butt" fill="none" />
    </>
  );
}

function EnterprisePaths({ p }: { p: ReturnType<typeof getFaviconPalette> }) {
  return (
    <>
      <rect x="7" y="14" width="18" height="4" rx="1" fill={p.accent} />
      <rect x="9" y="20" width="12" height="2" rx="0.5" fill={p.primary} opacity={0.35} />
    </>
  );
}

function FaviconPaths({
  direction,
  p,
}: {
  direction: FaviconDirection;
  p: ReturnType<typeof getFaviconPalette>;
}) {
  switch (direction) {
    case "monitoring":
      return <MonitoringPaths p={p} />;
    case "visibility":
      return <VisibilityPaths p={p} />;
    case "wordmark":
      return <WordmarkPaths p={p} />;
    case "enterprise":
      return <EnterprisePaths p={p} />;
    default:
      return <OperationsPaths p={p} />;
  }
}

/** Native SVG favicon mark — Satori-safe for app/icon routes */
export function FaviconMark({
  direction = PRODUCTION_FAVICON_DIRECTION,
  theme = "dark",
  size = 32,
  framed = true,
  className,
}: FaviconMarkProps) {
  const p = getFaviconPalette(theme);

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      {framed && (
        <>
          <rect width="32" height="32" rx={faviconFrame.radius} fill={p.frame} />
          <rect
            x="0.5"
            y="0.5"
            width="31"
            height="31"
            rx={faviconFrame.insetRadius}
            stroke={p.frameStroke}
            strokeOpacity={0.12}
            fill="none"
          />
        </>
      )}
      <FaviconPaths direction={direction} p={p} />
    </svg>
  );
}
