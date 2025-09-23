import { SystemSidebar } from "@/components/system/sidebar/system-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A proteção de rota agora é feita no middleware

  return (
    <main id='dashboard-layout' className='w-screen h-screen flex overflow-hidden bg-rose-200'>
      {/* Sidebar */}
      <SystemSidebar />
      {/* Section */}
      <section className='flex-1 flex flex-col bg-green-500'>
        <nav className='p-2 bg-purple-400 leading-3'>DashboardLayout</nav>
        <div className='flex-1 bg-amber-300 p-2'>{children}</div>
      </section>
    </main>
  );
}
