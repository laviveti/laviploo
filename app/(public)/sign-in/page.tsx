import { SignInForm } from "@/components/system/sign-in-form";
import { LogoFull } from "@/components/system/logo";

export default function SignInPage() {
  return (
    <section className='bg-white relative flex flex-col h-screen'>
      {/* Header */}

      {/* Form */}
      <div className='flex top-1/2 -translate-y-1/2 absolute justify-center px-4'>
        <SignInForm />
      </div>
      {/* Footer */}
      <footer className='justify-center mt-auto p-2 flex'>
        <h6 className='font-semibold text-xs text-zinc-500'>Feito com ❤️ pela equipe de TI.</h6>
      </footer>
    </section>
  );
}
