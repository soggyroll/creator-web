/** @format */

import { CreateWorkflowForm } from "@/components/workflows/create-workflow-form";

export default function CreateWorkflowPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex flex-col gap-8 py-10 px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create workflow
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish a ComfyUI workflow so your team (or the world) can run it.
        </p>
      </div>
      <CreateWorkflowForm />
    </div>
  );
}
