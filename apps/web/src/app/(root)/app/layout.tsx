import type { ReactNode } from 'react';
import AdminSidebar from '@/components/navigation/admin/admin-sidebar';

const APP_LAYOUT = ({ children }: { children: ReactNode }) => {
  return <AdminSidebar>{children}</AdminSidebar>;
};

export default APP_LAYOUT;
