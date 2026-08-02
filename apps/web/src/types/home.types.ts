import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

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
  icon: ComponentType<LucideProps>;
}

export interface ReferenceTab {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
}

export interface MetricItem {
  label: string;
  value: string;
  detail: string;
}
