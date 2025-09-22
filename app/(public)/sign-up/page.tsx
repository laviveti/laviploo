import { SignInForm } from "@/components/system/sign-in-form";
import { LogoFull } from "@/components/system/logo";

export default function SignUpPage() {
  return (
    <section className='bg-white flex flex-col h-screen'>
      {/* Header */}
      <div className='py-8 flex justify-center'>
        <LogoFull size='lg' />
      </div>
      {/* Form */}
      <div className='flex-1 flex pt-8 justify-center px-4'>
        <SignInForm />
      </div>
      {/* Footer */}
      <footer className='justify-center p-2 flex'>
        <h6 className='font-semibold text-sm text-zinc-500'>Feito com ❤️ pela equipe de TI.</h6>
      </footer>
    </section>
  );
}