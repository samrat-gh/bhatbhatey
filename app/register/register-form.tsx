'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { AutoCarousel } from './auto-carousel';

interface loginInterface {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { register, handleSubmit } = useForm<loginInterface>();
  const router = useRouter();

  const submitHandler = async (data: loginInterface) => {
    const { fullName, email, password, confirmPassword, phone } = data;
    if (password !== confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullName,
          email,
          password,
          phone,
        }),
      });

      if (!res.ok) {
        console.log(res.status, res.statusText);
        toast.warning('Failed to register. Please try again.');
        return;
      }

      const user = await res.json();
      toast.success(`User registered successfully`);
      if (user.success) {
        router.push('/vehicles');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.warning('An error occurred. Please try again later.');
    }
  };
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden border-orange-200">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Logo hasLabel={false} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Join Bhatbhatey
                </h1>
                <p className="text-muted-foreground text-balance">
                  Create your account to get started
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters long',
                    },
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
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
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  required
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/, // Example validation for 10-digit phone numbers
                      message: 'Invalid phone number',
                    },
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 text-white hover:bg-orange-700"
              >
                Create Account
              </Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <a
                  href="#"
                  className="text-orange-600 underline underline-offset-4 hover:text-orange-700"
                >
                  Sign in
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden md:block">
            <AutoCarousel />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-orange-600">
        By clicking create account, you agree to our{' '}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
