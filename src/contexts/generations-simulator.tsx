/** @format */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  GithubComComfyCreatorsCreatorBackendInternalServiceGenerationGenerationInput as GenInput,
  GithubComComfyCreatorsCreatorBackendInternalServiceGenerationGenerationResult as GenResult,
} from "@/api/models";

// ---------------------------------------------------------------------------
// Initial seed data
// ---------------------------------------------------------------------------

const INITIAL: GenResult[] = [
  {
    output_url: "https://picsum.photos/seed/gen1/800/800",
    output_expiry: "2026-05-14T08:00:42Z",
    generation: {
      id: "a1b2c3d4-0001-0001-0001-000000000001",
      status: "completed",
      prompt: "A serene mountain landscape at golden hour",
      credit_cost: 4,
      enqueued_at: "2026-04-14T08:00:00Z",
      started_at: "2026-04-14T08:00:05Z",
      finished_at: "2026-04-14T08:00:42Z",
      attachments: [
        { type: "image", url: "https://picsum.photos/seed/gen1/400/300" },
      ],
    },
  },
  {
    output_url: "https://picsum.photos/seed/gen2/800/800",
    output_expiry: "2026-05-13T16:22:58Z",
    generation: {
      id: "a1b2c3d4-0002-0002-0002-000000000002",
      status: "completed",
      prompt: "Cyberpunk city with neon lights and rain",
      credit_cost: 4,
      enqueued_at: "2026-04-13T16:22:10Z",
      started_at: "2026-04-13T16:22:15Z",
      finished_at: "2026-04-13T16:22:58Z",
      attachments: [
        { type: "image", url: "https://picsum.photos/seed/gen2/400/300" },
      ],
    },
  },
  {
    generation: {
      id: "a1b2c3d4-0003-0003-0003-000000000003",
      status: "failed",
      prompt: "Deep sea creature bioluminescent glow",
      credit_cost: 0,
      enqueued_at: "2026-04-13T11:05:00Z",
      started_at: "2026-04-13T11:05:10Z",
      finished_at: "2026-04-13T11:05:25Z",
      error_log: "Worker timeout after 15s",
    },
  },
  {
    output_url: "https://picsum.photos/seed/gen6/800/800",
    output_expiry: "2026-05-12T14:44:50Z",
    generation: {
      id: "a1b2c3d4-0006-0006-0006-000000000006",
      status: "completed",
      prompt: "Minimalist Japanese ink brush painting of a crane",
      credit_cost: 4,
      enqueued_at: "2026-04-12T14:44:00Z",
      started_at: "2026-04-12T14:44:06Z",
      finished_at: "2026-04-12T14:44:50Z",
      attachments: [
        { type: "image", url: "https://picsum.photos/seed/gen6/400/300" },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface SimulatorContextValue {
  generations: GenResult[];
  /** Adds a generation and drives it through queued → running → completed/failed. Returns the new generation id. */
  createGeneration: (input: GenInput) => string;
  /** Adds multiple generations as one local batch. Returns the new generation ids. */
  createGenerationBatch: (inputs: GenInput[]) => string[];
}

const SimulatorContext = createContext<SimulatorContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function GenerationsSimulatorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [generations, setGenerations] = useState<GenResult[]>(INITIAL);

  const update = useCallback(
    (id: string, patch: (prev: GenResult) => GenResult) => {
      setGenerations((all) =>
        all.map((r) => (r.generation?.id === id ? patch(r) : r)),
      );
    },
    [],
  );

  const createGeneration = useCallback(
    (input: GenInput): string => {
      const id = crypto.randomUUID();
      const seed = id.slice(0, 8);
      const now = new Date().toISOString();

      const entry: GenResult = {
        generation: {
          id,
          status: "queued",
          prompt: input.prompt,
          credit_cost: 4,
          enqueued_at: now,
        },
      };

      setGenerations((prev) => [entry, ...prev]);

      // queued → running
      setTimeout(() => {
        update(id, (r) => ({
          ...r,
          generation: {
            ...r.generation,
            status: "running",
            started_at: new Date().toISOString(),
          },
        }));

        // running → completed | failed
        const processingMs = 3000 + Math.random() * 3000;
        const willFail = Math.random() < 0.1;

        setTimeout(() => {
          const finishedAt = new Date().toISOString();

          if (willFail) {
            update(id, (r) => ({
              ...r,
              generation: {
                ...r.generation,
                status: "failed",
                finished_at: finishedAt,
                credit_cost: 0,
                error_log: "Worker timeout: generation failed to complete",
              },
            }));
          } else {
            update(id, (r) => ({
              output_url: `https://picsum.photos/seed/${seed}/800/800`,
              output_expiry: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              generation: {
                ...r.generation,
                status: "completed",
                finished_at: finishedAt,
                attachments: [
                  {
                    type: "image",
                    url: `https://picsum.photos/seed/${seed}/400/300`,
                  },
                ],
              },
            }));
          }
        }, processingMs);
      }, 1500);

      return id;
    },
    [update],
  );

  const createGenerationBatch = useCallback(
    (inputs: GenInput[]): string[] =>
      inputs.map((input) => createGeneration(input)),
    [createGeneration],
  );

  return (
    <SimulatorContext.Provider
      value={{ generations, createGeneration, createGenerationBatch }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGenerationsSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) {
    throw new Error(
      "useGenerationsSimulator must be used within <GenerationsSimulatorProvider>",
    );
  }
  return ctx;
}
