import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
