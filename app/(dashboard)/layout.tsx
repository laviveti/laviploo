import { SystemSidebar } from "@/components/system/sidebar/system-sidebar";
import { SystemHeader } from "@/components/system/header/system-header";
import { auth } from "@/lib/auth/better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Verifica se o usuário está autenticado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main id='dashboard-layout' className='w-screen h-screen flex overflow-hidden bg-rose-200'>
      {/* Sidebar */}
      <SystemSidebar />
      {/* Section */}
      <section className='flex-1 shadow flex flex-col'>
        {/* <nav className='p-2 bg-gradient-to-r from-purple-400 to-lavive to-40% leading-3'> */}
        <nav className='py-1 px-3 bg-gradient-to-r from-lavive to-rose-500 leading-3'>
          <SystemHeader />
        </nav>
        <div className='flex-1 overflow-x-hidden overflow-y-auto'>{children}</div>
      </section>
    </main>
  );
}
