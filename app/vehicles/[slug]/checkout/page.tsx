import Link from 'next/link';

import CheckoutForm from '@/components/checkout/checkout-form';
import VehicleNotFound from '@/components/product-not-found';

interface Vehicle {
  id: string;
  name: string;
  slug: string;
  type: string;
  brand: string;
  model: string;
  description: string;
  mileage: number;
  costPerDay: number;
  imageUrl: string;
  available: boolean;
  createdAt: string;
  merchantId: string;
}

interface ApiResponse {
  success: boolean;
  mesage: string; // Note: API has typo "mesage" instead of "message"
  data: Vehicle;
}

async function getVehicle(slug: string): Promise<Vehicle | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/vehicle/${slug}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.log('Error fetching vehicle:', response.statusText);
      return null;
    }

    const apiResponse: ApiResponse = await response.json();

    if (!apiResponse.success || !apiResponse.data) {
      console.log('API returned unsuccessful response');
      return null;
    }

    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    return <VehicleNotFound />;
  }

  if (!vehicle.available) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vehicle Unavailable
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, this vehicle is currently not available for booking.
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Other Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link
              href="/vehicles"
              className="hover:text-blue-600 transition-colors"
            >
              Vehicles
            </Link>
            <span>•</span>
            <Link
              href={`/vehicles/${slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {vehicle.name}
            </Link>
            <span>•</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <CheckoutForm vehicle={vehicle} />
    </>
  );
}
