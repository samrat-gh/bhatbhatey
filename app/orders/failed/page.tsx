'use client';

import { AlertTriangle, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderFailedPage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Card className="text-center border-destructive/20 shadow-sm">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle
                className="w-9 h-9 text-destructive"
                aria-hidden="true"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Failed
            </CardTitle>
            <p className="text-gray-600 mt-2 leading-relaxed">
              We couldn&apos;t complete your booking payment. This can happen
              due to network issues, an interrupted eSewa flow, or an expired
              session.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="w-5 h-5 text-destructive mt-0.5"
                  aria-hidden="true"
                />
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Your card / wallet wasn&apos;t charged.</li>
                  <li>• Any held amount will auto-release shortly.</li>
                  <li>• You can safely try again.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <h3 className="font-semibold text-gray-900">Quick Fixes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure stable internet before retrying</li>
                <li>• Keep your eSewa app open & logged in</li>
                <li>• Don&apos;t refresh during payment redirect</li>
              </ul>
            </div>

            <div className="grid gap-3">
              <Button
                onClick={handleRetry}
                className="w-full"
                aria-label="Retry payment"
              >
                Retry Payment
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                asChild
                variant="destructive"
                className="w-full shadow-sm"
                aria-label="Browse vehicles"
              >
                <Link href="/vehicles">Browse Vehicles</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
                aria-label="Back to home"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Home
                </Link>
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Need help? Reach out to support at{' '}
              <span className="font-medium text-gray-700">
                support@bhatbhatey.com
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
