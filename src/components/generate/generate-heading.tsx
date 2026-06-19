/** @format */
"use client";

import { useWorkflow } from "@/hooks/use-workflow";
import { FC } from "react";

interface GenerateHeadingProps {
  workflowId: string;
}

const GenerateHeading: FC<GenerateHeadingProps> = ({ workflowId }) => {
  const { data } = useWorkflow(workflowId);
  const workflow = data?.workflow;

  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-3xl">
        <span className="text-muted-foreground">
          {workflow?.team?.name ?? "workflows"}/
        </span>
        {workflow?.name}
      </h1>
      <p className="text-muted-foreground max-w-3xl">
        {workflow?.description ?? "Generate an image using the power of AI."}
      </p>
    </div>
  );
};

export default GenerateHeading;
