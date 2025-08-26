'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@workspace/ui/components/sidebar';
import { User } from 'lucide-react';
import NavGroup from './nav-group';
import NavUser from './nav-user';
import type { AdminNavGroup } from './types';

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const navGroups: AdminNavGroup[] = [
    {
      title: 'Application',
      items: [
        {
          title: 'User',
          icon: User,
          items: [
            {
              title: 'Govi Profile',
              url: '/app/profile/farmer',
            },
            {
              title: 'User Profile',
              url: '/app/profile/user',
            },
          ],
        },
      ],
    },
  ];

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
