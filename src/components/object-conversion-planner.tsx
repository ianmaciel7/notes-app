"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import {
  canCommitObjectConversion,
  commitObjectConversion,
  type CommittedObjectConversion,
  type ConversionFieldPlan,
  type ObjectConversionPlan,
  resolveConversionField,
} from "@/lib/workspace-object-views";

type ObjectConversionPlannerLabels = {
  readonly cancel: string;
  readonly commit: string;
  readonly discardValue: string;
  readonly incompatible: string;
  readonly mapTo: string;
  readonly requiresConfirmation: string;
  readonly unresolved: string;
};

type ObjectConversionPlannerProps = {
  readonly initialPlan: ObjectConversionPlan;
  readonly labels: ObjectConversionPlannerLabels;
  readonly onCancel: () => void;
  readonly onCommit: (conversion: CommittedObjectConversion) => void;
  readonly target: WorkspaceStructure;
};

const DISCARD_VALUE = "__discard__";

function fieldStatusLabel(
  field: ConversionFieldPlan,
  labels: ObjectConversionPlannerLabels,
): string {
  if (field.resolution.kind === "unresolved") return labels.unresolved;
  if (field.compatibility === "incompatible") return labels.incompatible;
  if (field.compatibility === "requires-confirmation") {
    return labels.requiresConfirmation;
  }
  return "";
}

function selectedResolutionValue(field: ConversionFieldPlan): string {
  if (field.resolution.kind === "discard") return DISCARD_VALUE;
  if (field.resolution.kind === "map") {
    return field.resolution.targetPropertyId;
  }
  return "";
}

function ObjectConversionField({
  field,
  labels,
  onChange,
  target,
}: {
  readonly field: ConversionFieldPlan;
  readonly labels: ObjectConversionPlannerLabels;
  readonly onChange: (sourcePropertyId: string, value: string) => void;
  readonly target: WorkspaceStructure;
}) {
  const status = fieldStatusLabel(field, labels);
  return (
    <li className="grid gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,1fr)] sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{field.sourcePropertyId}</p>
        <p className="text-xs text-muted-foreground">{field.reason}</p>
        {status ? <p className="mt-1 text-xs font-medium">{status}</p> : null}
      </div>
      <label className="grid gap-1 text-xs font-medium">
        <span>{labels.mapTo}</span>
        <select
          value={selectedResolutionValue(field)}
          className="h-9 rounded-md border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(event: { currentTarget: HTMLSelectElement }) =>
            onChange(field.sourcePropertyId, event.currentTarget.value)
          }
        >
          <option value="">{labels.unresolved}</option>
          <option value={DISCARD_VALUE}>{labels.discardValue}</option>
          {target.propertyDefinitions
            .filter((definition) => definition.writable)
            .map((definition) => (
              <option key={definition.id} value={definition.id}>
                {definition.name}
              </option>
            ))}
        </select>
      </label>
    </li>
  );
}

function ObjectConversionPlanner({
  initialPlan,
  labels,
  onCancel,
  onCommit,
  target,
}: ObjectConversionPlannerProps) {
  const [plan, setPlan] = React.useState(initialPlan);
  const [error, setError] = React.useState<string | null>(null);

  const handleResolutionChange = React.useCallback(
    (sourcePropertyId: string, value: string) => {
      if (!value) return;
      const resolution =
        value === DISCARD_VALUE
          ? ({ kind: "discard" } as const)
          : ({ kind: "map", targetPropertyId: value } as const);
      const result = resolveConversionField(
        plan,
        sourcePropertyId,
        resolution,
        target,
      );
      if (result.ok) {
        setPlan(result.value);
        setError(null);
      } else {
        setError(result.error.message);
      }
    },
    [plan, target],
  );

  const handleCommit = React.useCallback(() => {
    const result = commitObjectConversion(plan);
    if (result.ok) {
      onCommit(result.value);
      setError(null);
    } else {
      setError(result.error.message);
    }
  }, [onCommit, plan]);

  return (
    <div className="grid gap-4" data-slot="object-conversion-planner">
      <ul className="grid gap-2">
        {plan.fields.map((field) => (
          <ObjectConversionField
            key={field.sourcePropertyId}
            field={field}
            labels={labels}
            onChange={handleResolutionChange}
            target={target}
          />
        ))}
      </ul>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {labels.cancel}
        </Button>
        <Button
          type="button"
          disabled={!canCommitObjectConversion(plan)}
          onClick={handleCommit}
        >
          {labels.commit}
        </Button>
      </div>
    </div>
  );
}

export { ObjectConversionPlanner };
export type { ObjectConversionPlannerLabels };
