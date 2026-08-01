export interface DocLink {
  id: string;
  name: string;
}

export interface DocCategory {
  title: string;
  links: DocLink[];
}

export interface DocCallout {
  type: "note" | "important" | "tip" | "info";
  text: string;
}

export interface DocTable {
  headers: string[];
  rows: string[][];
}

export interface DocSection {
  id: string;
  category: string;
  title: string;
  description: string;
  callout?: DocCallout;
  table?: DocTable;
  codeBlock?: string;
  codeLanguage?: string;
}
