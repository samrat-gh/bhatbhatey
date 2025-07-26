import { getCurrentUser } from '@/lib/auth';

export default async function Page() {
  const user = await getCurrentUser();

  if (user) return <div className="mt-28">{JSON.stringify(user)}</div>;
  else {
    return <div>Ghar jaa</div>;
  }
}
