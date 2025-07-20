import Link from 'next/link';
import type React from 'react';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { AutoCarousel } from './auto-carousel';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden border-orange-200">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Logo hasLabel={false} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to Bhatbhatey
                </h1>
                <p className="text-muted-foreground text-balance">
                  Sign in to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="ml-auto text-sm text-orange-600 underline-offset-2 hover:text-orange-700 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 text-white hover:bg-orange-700"
              >
                Sign In
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="register"
                  className="text-orange-600 underline underline-offset-4 hover:text-orange-700"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden md:block">
            <AutoCarousel />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-orange-600">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
