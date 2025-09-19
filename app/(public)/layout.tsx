import { LogoFull } from "@/components/system/logo";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id='public-layout' className='w-screen h-screen flex overflow-hidden'>
      {/* Logo */}
      {/* <section className='w-6/9 flex flex-col justify-center items-center bg-gradient-to-br from-50% to-50% from-lavive to-purple-500'> */}
      <section className='w-6/9 flex flex-col justify-center items-center bg-gradient-to-br from-rose-500 via-pink-400 to-purple-600'>
        <div className='p-2 flex justify-center items-center rounded-2xl bg-white'>
          <LogoFull size='2xl' />
        </div>
      </section>
      {/* Pages Section */}
      <section className='flex-1'>{children}</section>
    </main>
  );
}
