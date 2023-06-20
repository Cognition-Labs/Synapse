export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  openNewTab?: boolean;
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Github',
    href: 'https://github.com/Cognition-Labs/Synapse',
    openNewTab: true,
  },
];
