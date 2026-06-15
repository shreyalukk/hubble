import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#FAF6F0", color: "#1a1a1a" }}>
      <Sidebar />
      <Topbar />
      
      {/* Main content */}
      <main className="pl-16 md:pl-[72px] pt-16 min-h-screen pb-10">
        <div className="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
