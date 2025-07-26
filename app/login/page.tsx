import { getCurrentUser } from '@/lib/auth';

import { LoginForm } from './login-form';

export default async function LoginPage() {
  const user = await getCurrentUser();

  // if (user) {
  //   redirect('/vehicles');
  // }

  // if (!user)
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
