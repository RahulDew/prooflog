export interface ReleaseInfo {
  version: string;
  date: string;
  title: string;
  type: "major" | "minor" | "patch";
  commitSha: string;
  description: string;
  changes: string[];
}
