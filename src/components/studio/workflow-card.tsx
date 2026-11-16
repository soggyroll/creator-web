import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import type { Workflow } from "@/types/entities";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <Link href={`/workflows/${workflow.id}`} className="workflow-card">
      <div className="workflow-card-media">
        {workflow.cover_url ? <Image src={workflow.cover_url} alt="" fill sizes="(max-width: 600px) calc(100vw - 90px), (max-width: 1100px) 40vw, 28vw" className="object-cover" /> : <ImageIcon className="size-8 text-muted-foreground" aria-hidden="true" />}
      </div>
      <div className="workflow-card-label"><span>{workflow.name}</span><ArrowUpRight className="size-4 shrink-0" aria-hidden="true" /></div>
      {workflow.description && <p className="workflow-card-description line-clamp-2">{workflow.description}</p>}
      <div className="workflow-card-meta"><span>{workflow.cost.toLocaleString()} cr / run</span><span>{(workflow.stats?.runs ?? 0).toLocaleString()} runs</span></div>
    </Link>
  );
}
