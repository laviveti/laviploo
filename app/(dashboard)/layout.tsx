export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id='dashboard-layout' className='w-screen h-screen flex overflow-hidden bg-rose-200'>
      {/* Sidebar */}
      <aside className='w-45 bg-rose-400 h-full'>Sidebar</aside>
      {/* Section */}
      <section className='flex-1 flex flex-col bg-green-500'>
        <nav className='p-2 bg-purple-400 leading-3'>DashboardLayout</nav>
        <div className='flex-1 bg-amber-300 p-2'>{children}</div>
      </section>
    </main>
  );
}
