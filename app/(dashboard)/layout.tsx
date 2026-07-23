import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { PresenceProvider } from "@/components/providers/presence-provider";
import { PageTransition } from "@/components/providers/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PresenceProvider>
      <div className="min-h-screen font-sans bg-background text-foreground">
        <Sidebar />
        <Topbar />
        
        {/* Main content */}
        <main className="pl-16 md:pl-[72px] pt-16 min-h-screen pb-10">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-10 h-full">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </PresenceProvider>
  );
}
