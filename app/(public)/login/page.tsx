import { LoginForm } from "@/components/system/login-form";

export default function LoginPage() {
  return (
    <section className='bg-gradient-to-br from-rose-400 via-purple-500 to-purple-700 relative flex h-screen'>
      {/* Card com logo à esquerda */}
      <div className='flex items-center justify-center w-1/2 p-16'>
        <div className='bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl'>
          {/* Logo LaviPloo */}
          <div className='flex items-center justify-center mb-6'>
            <div className='w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center mr-4'>
              <div className='w-8 h-8 border-2 border-white rounded-full'></div>
            </div>
            <h1 className='text-4xl font-bold'>
              <span className='text-rose-500'>Lavi</span>
              <span className='text-purple-600'>Ploo</span>
            </h1>
          </div>
          <p className='text-rose-400 text-lg font-medium'>
            Visualize suas principais informações Ploomes!
          </p>
        </div>
      </div>

      {/* Lado direito com formulário */}
      <div className='flex items-center justify-center w-1/2 bg-gray-50 p-16'>
        <div className='max-w-md w-full'>
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <footer className='absolute bottom-4 right-4'>
        <p className='text-white text-sm font-medium'>
          Feito com ❤️ pela equipe de TI.
        </p>
      </footer>
    </section>
  );
}