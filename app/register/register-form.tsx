import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AutoCarousel } from "./auto-carousel";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-orange-200">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-xl">B</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Join Bhatbhatey
                </h1>
                <p className="text-balance text-muted-foreground">
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
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Create Account
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 underline underline-offset-4">
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
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-orange-600">
        By clicking create account, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
