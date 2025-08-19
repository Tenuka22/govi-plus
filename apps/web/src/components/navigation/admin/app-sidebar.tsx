'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@workspace/ui/components/sidebar';
import NavGroup from './nav-group';
import NavUser from './nav-user';
import type { AdminNavGroup } from './types';

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const navGroups: AdminNavGroup[] = [];

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
