import Link from 'next/link';

import { Button } from '../ui/button';

export default function LoginTrigger() {
  const user = undefined;
  if (user)
    return (
      <Button className="bg-orange-500 hover:bg-orange-600 text-white w-fit px-3 py-2 rounded-md transition-colors">
        Sign In
      </Button>
    );
  else {
    return (
      <Link
        href="/login"
        className="bg-orange-500 hover:bg-orange-600 text-white w-fit px-3 py-2 rounded-md transition-colors"
      >
        Sign In
      </Link>
    );
  }
}
