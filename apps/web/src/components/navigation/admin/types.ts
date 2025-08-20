interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

export type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[];
  url?: never;
};

export type NavItem = NavCollapsible | NavLink;

export interface AdminNavGroup {
  title: string;
  items: NavItem[];
}
