import Link from 'next/link';

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

async function getProduct(slug: string): Promise<Vehicle | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/vehicle/${slug}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.log('error fetching product:', response.statusText);
      return null;
    }

    const apiResponse: ApiResponse = await response.json();

    if (!apiResponse.success || !apiResponse.data) {
      console.log('API returned unsuccessful response');
      return null;
    }

    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return <VehicleNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    product.available
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {product.available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-md border">
                <div className="text-2xl font-bold text-blue-600">
                  {product.mileage}
                </div>
                <div className="text-sm text-gray-600">km/L</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md border">
                <div className="text-2xl font-bold text-green-600">
                  ₹{product.costPerDay.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Per Day</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md border">
                <div className="text-2xl font-bold text-purple-600">
                  {product.type}
                </div>
                <div className="text-sm text-gray-600">Type</div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xl text-gray-600 mt-2 font-medium">
                    {product.brand} • {product.model}
                  </p>
                </div>
                <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {product.type}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-green-700">
                  ₹{product.costPerDay.toLocaleString()}
                </span>
                <span className="text-lg text-green-600 font-medium">/day</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Best price guaranteed
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {product.available ? (
                <Link
                  href={`/vehicles/${slug}/checkout`}
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Proceed to Checkout</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Link>
              ) : (
                <button
                  disabled
                  className="block w-full bg-gray-300 text-gray-500 text-center py-4 px-6 rounded-xl font-semibold cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}

              <button className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border hover:border-gray-300">
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>Add to Wishlist</span>
                </span>
              </button>
            </div>

            {/* Specifications */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Brand
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {product.brand}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Model
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {product.model}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Type
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {product.type}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Mileage
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {product.mileage} km/L
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
