'use client';
import { Badge } from '@workspace/ui/components/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { Small, XSmall } from '@workspace/ui/design-system/typography';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { AdminNavGroup } from './types';

const NavGroup = ({ title, items }: AdminNavGroup) => {
  const { state, isMobile } = useSidebar();
  const href = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items) {
            return <SidebarMenuLink href={href} item={item} key={key} />;
          }
          if (state === 'collapsed' && !isMobile) {
            return (
              <SidebarMenuCollapsedDropdown href={href} item={item} key={key} />
            );
          }
          return <SidebarMenuCollapsible href={href} item={item} key={key} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavGroup;

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <Small>{item.title}</Small>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      asChild
      className="group/collapsible"
      defaultOpen={checkIsActive(href, item, true)}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <Small>{item.title}</Small>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <Small>{subItem.title}</Small>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            isActive={checkIsActive(href, item)}
            tooltip={item.title}
          >
            {item.icon && <item.icon />}
            <Small>{item.title}</Small>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem asChild key={`${sub.title}-${sub.url}`}>
              <Link
                className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                href={sub.url}
              >
                {sub.icon && <sub.icon />}
                <Small className="max-w-52 text-wrap">{sub.title}</Small>
                {sub.badge && (
                  <XSmall className="ml-auto text-xs">{sub.badge}</XSmall>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

const checkIsActive = (href: string, item: NavItem, mainNav = false) => {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  );
};
