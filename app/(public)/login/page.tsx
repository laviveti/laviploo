import { LoginForm } from "@/components/system/login-form";

export default function LoginPage() {
  return (
    <section className='relative flex flex-col h-screen'>
      {/* Formulário centralizado */}
      <div className='flex items-center px-10 justify-center w-full h-full'>
        <LoginForm />
      </div>

      {/* Footer */}
      <footer className='flex w-full justify-center pb-3'>
        <p className='text-zinc-500 text-sm font-medium'>Feito com ❤️ pela equipe de TI.</p>
      </footer>
    </section>
  );
}
