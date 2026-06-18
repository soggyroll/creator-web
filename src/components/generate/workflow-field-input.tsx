/** @format */

"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { PrimitiveWorkflowField } from "./types";

interface WorkflowFieldInputProps {
  field: PrimitiveWorkflowField;
  value: string | number;
  onChange: (value: string | number) => void;
}

export function WorkflowFieldInput({
  field,
  value,
  onChange,
}: WorkflowFieldInputProps) {
  if (field.kind === "text") {
    return field.multiline ? (
      <Textarea
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        rows={field.title.toLowerCase().includes("prompt") ? 5 : 3}
      />
    ) : (
      <Input
        type="text"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.kind === "int") {
    return (
      <Input
        type="number"
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  return (
    <Input
      type="number"
      step="any"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
