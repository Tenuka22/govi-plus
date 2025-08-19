import { SidebarProvider } from '@workspace/ui/components/sidebar';
import { Flex } from '@workspace/ui/design-system/spacing';
import { cn } from '@workspace/ui/lib/utils';
import type { ReactNode } from 'react';
import AppSidebar from './app-sidebar';

const AdminSidebar = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <Flex
        className={cn(
          'ml-auto w-full max-w-full px-2 py-4',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear',
          'h-svh',
          'group-data-[scroll-locked=1]/body:h-full',
          'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
        )}
        direction="col"
        id="content"
        spacing="md"
      >
        {children}
      </Flex>
    </SidebarProvider>
  );
};

export default AdminSidebar;
