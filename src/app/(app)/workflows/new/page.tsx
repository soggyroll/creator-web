/** @format */

import { CreateWorkflowForm } from "@/components/workflows/create-workflow-form";
import { PageHeading } from "@/components/studio/page-heading";

export default function CreateWorkflowPage() {
  return (
    <div className="studio-page">
      <PageHeading eyebrow="From your studio" title="Make a starting point." description="Publish a ComfyUI workflow so your team—or the world—can run it." />
      <CreateWorkflowForm />
    </div>
  );
}
