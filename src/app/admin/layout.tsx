import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-background">
                <AdminSidebar />
                <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
