'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Button } from '../ui/button';

export default function LoginTrigger() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="bg-gray-200 animate-pulse w-20 h-10 rounded-md"></div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/vehicles">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
            size="sm"
          >
            Browse
          </Button>
        </Link>
        <Link href="/orders">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
            size="sm"
          >
            Orders
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="sm"
          >
            Profile
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
        Sign In
      </Button>
    </Link>
  );
}
