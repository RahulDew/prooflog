export interface NavLinkItem {
  name: string;
  path: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { name: string; path: string; external?: boolean }[];
}
