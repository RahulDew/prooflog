import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export interface AboutPillar {
  title: string;
  desc: string;
  icon: ComponentType<LucideProps>;
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
