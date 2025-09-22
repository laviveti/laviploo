import { SignInForm } from "@/components/system/sign-in-form";
import { LogoFull } from "@/components/system/logo";

export default function SignInPage() {
  return (
    <section className='bg-white relative flex flex-col h-screen'>
      {/* Form  */}
      <div className='flex  absolute w-full top-1/2 -translate-y-1/2 px-4'>
        <SignInForm />
      </div>
      {/* Footer */}
      <footer className='justify-center h-fit  mt-auto p-2 flex'>
        <h6 className='font-semibold text-xs text-zinc-500'>Desenvolvido com ❤️ pela equipe de TI.</h6>
      </footer>
    </section>
  );
}
