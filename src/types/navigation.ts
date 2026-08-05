export interface NavItem {
  label: string;
  path: string;
  badge?: string;
}

export interface FooterSection {
  title: string;
  links: { label: string; path: string; external?: boolean }[];
}
