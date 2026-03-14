import { ImageResponse } from "next/og";

const backgroundColor = "#1f2a44";
const accentColor = "#f8fafc";
const subtleAccentColor = "#94a3b8";

export function createPwaIconResponse(size: number) {
  const fontSize = Math.round(size * 0.34);
  const badgeSize = Math.round(size * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: backgroundColor,
          color: accentColor,
          display: "flex",
          flexDirection: "column",
          fontFamily:
            'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: `${Math.max(4, Math.round(size * 0.018))}px solid rgba(248, 250, 252, 0.14)`,
            borderRadius: Math.round(size * 0.22),
            display: "flex",
            height: Math.round(size * 0.68),
            inset: Math.round(size * 0.08),
            position: "absolute",
            width: Math.round(size * 0.68),
          }}
        />
        <div
          style={{
            fontSize,
            fontWeight: 800,
            letterSpacing: `-${Math.round(size * 0.02)}px`,
            lineHeight: 1,
          }}
        >
          LL
        </div>
        <div
          style={{
            color: subtleAccentColor,
            fontSize: Math.round(size * 0.08),
            fontWeight: 600,
            letterSpacing: `${Math.max(1, Math.round(size * 0.012))}px`,
            marginTop: Math.round(size * 0.05),
            textTransform: "uppercase",
          }}
        >
          Placeholder
        </div>
        <div
          style={{
            alignItems: "center",
            background: accentColor,
            borderRadius: 9999,
            bottom: Math.round(size * 0.1),
            color: backgroundColor,
            display: "flex",
            fontSize: Math.round(size * 0.075),
            fontWeight: 800,
            height: badgeSize,
            justifyContent: "center",
            position: "absolute",
            right: Math.round(size * 0.1),
            width: badgeSize,
          }}
        >
          V1
        </div>
      </div>
    ),
    {
      height: size,
      width: size,
    },
  );
}
