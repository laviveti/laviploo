import { LogoFull } from "@/components/system/logo";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id='public-layout' className='w-screen h-screen flex overflow-hidden'>
      {/* Logo */}
      <section className='w-6/9 flex flex-col justify-center items-center laviploo-gradient'>
        <div className='py-5 px-10 flex flex-col justify-center items-center rounded-2xl bg-white'>
          <LogoFull size='2xl' />
          <h4 className='text-lavive font-bold leading-3 pt-1'>
            Visualize suas principais informações <span className='text-purple-700'>Ploomes</span>!
          </h4>
        </div>
      </section>
      {/* Pages Section */}
      <section className='flex-1'>{children}</section>
    </main>
  );
}
