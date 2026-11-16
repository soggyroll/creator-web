"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const STUDIES = [
  { key: "clay", name: "Clay forms", index: "01" },
  { key: "terrain", name: "Dream terrain", index: "02" },
  { key: "signal", name: "Signal studies", index: "03" },
] as const;

export function MediaReel() {
  const [selected, setSelected] = useState<string>("terrain");
  const study = STUDIES.find((item) => item.key === selected)!;

  return (
    <section aria-label="Explore procedural illustrations">
      <div className="studio-filmstrip">
        <div className="studio-film-frames">
          {STUDIES.map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn("studio-study", `studio-study-${item.key}`)}
              aria-label={`Select ${item.name} illustration`}
              aria-pressed={selected === item.key}
              onClick={() => setSelected(item.key)}
            >
              <span className="studio-study-caption">
                <span className="studio-study-index">{item.index}</span>
                <span className="studio-study-name">{item.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="studio-reel-caption">
        <span aria-live="polite">{study.index} / {study.name}</span>
        <span>Procedural illustrations · select a frame</span>
      </div>
    </section>
  );
}
