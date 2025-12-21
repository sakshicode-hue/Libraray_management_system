'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './DashboardLayout';

const authRoutes = ['/login', '/register', '/forgot-password'];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.includes(pathname || '');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

