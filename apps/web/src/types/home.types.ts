import type { ComponentType } from "react";

export interface LiveLog {
  sequence: number;
  action: string;
  idempotencyKey: string;
  hash: string;
  status: "Verified" | "Pending";
  timestamp: string;
}

export interface LifecycleCard {
  q: string;
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
}

export interface ArchitectureStep {
  step: string;
  title: string;
  desc: string;
}

export interface ReferenceTab {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface MetricItem {
  label: string;
  value: string;
  detail: string;
}

export interface PricingRow {
  feature: string;
  self: string;
  cloud: string;
  ent: string;
}
