/** @format */

import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Soggy Roll — ComfyUI workflows on demand";

const BG = "#0d0c17";
const DIM = "#242434";

export default function Image() {
  const logoData = readFileSync(join(process.cwd(), "public/soggyroll.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        background: BG,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative yellow ring — top right */}
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -260,
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: "1px solid rgba(234,212,0,0.08)",
          background: "rgba(234,212,0,0.035)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -180,
          right: -180,
          width: 540,
          height: 540,
          borderRadius: "50%",
          border: "1px solid rgba(234,212,0,0.05)",
          display: "flex",
        }}
      />

      {/* Decorative magenta ring — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: -300,
          left: -140,
          width: 580,
          height: 580,
          borderRadius: "50%",
          border: "1px solid rgba(204,31,119,0.07)",
          background: "rgba(204,31,119,0.025)",
          display: "flex",
        }}
      />

      {/* Wordmark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="Soggy Roll"
        width={680}
        height={188}
        style={{ objectFit: "contain" }}
      />

      {/* Tagline */}
      <div
        style={{
          marginTop: 44,
          fontSize: 28,
          color: "magenta",
          letterSpacing: 1,
          display: "flex",
        }}
      >
        Why take the pain of infrastructure when you can generate with Soggy
        Roll?
      </div>

      {/* Domain */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          right: 72,
          fontSize: 14,
          color: DIM,
          letterSpacing: 2,
          display: "flex",
        }}
      >
        soggyroll.art
      </div>
    </div>,
    { ...size },
  );
}
