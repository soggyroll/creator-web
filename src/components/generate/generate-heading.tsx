/** @format */
"use client";

import { useWorkflows } from "@/hooks/use-workflows";
import { FC } from "react";

interface GenerateHeadingProps {
  workflowId: string | null;
}

const GenerateHeading: FC<GenerateHeadingProps> = ({ workflowId }) => {
  const { data: workflows } = useWorkflows();
  const workflow = workflows?.find((w) => w.id === workflowId);

  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-3xl">
        <span className="text-muted-foreground">
          {workflow?.team?.name ?? "workflows"}/
        </span>
        Generate {workflow?.name}
      </h1>
      <p className="text-muted-foreground max-w-3xl">
        {workflow?.description ?? "Generate an image using the power of AI."}
      </p>
    </div>
  );
};

export default GenerateHeading;
