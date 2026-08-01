import type { ComponentType } from "react";

export interface AboutPillar {
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
}

export interface SecurityGuarantee {
  title: string;
  detail: string;
  badge: string;
}

export interface TeamContributor {
  name: string;
  role: string;
  avatar: string;
  github: string;
}
