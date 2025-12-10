import { Calendar, CheckCircle, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDecodeToken } from '@/lib/generate-esewa-signature';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ data: string | undefined }>;
}) {
  const currentSearchParams = await searchParams;

  const decodedData = getDecodeToken(currentSearchParams.data || '');
  // console.log(decodedData);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Booking Confirmed!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Your vehicle booking has been successfully placed.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  Confirmation email sent to your registered email
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  We&apos;ll contact you 24 hours before pickup
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">What&apos;s Next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check your email for booking details</li>
                <li>• Prepare your driving license</li>
                <li>• Be ready at pickup location on time</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/vehicles">Browse More Vehicles</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* {JSON.stringify(decodedData)} */}
    </div>
  );
}
