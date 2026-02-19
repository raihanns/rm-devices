import AdminLayout from '@/components/admin/AdminLayout';

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
