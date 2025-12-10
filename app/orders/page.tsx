'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  imageUrl: string | null;
  costPerDay: number;
}

interface Rental {
  startDate: string;
  endDate: string;
  status: string;
}

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Order {
  id: string;
  pickupDate: string;
  totalCost: number;
  pickupLocation: string;
  status: string;
  createdAt: string;
  vehicle: Vehicle;
  rental: Rental;
  payments: Payment[];
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);

        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrders(data.orders);
          } else {
            toast.error('Failed to fetch orders');
          }
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error) {
        toast.error('An error occurred while fetching orders');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/login',
        redirect: true,
      });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRentalDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrder(orderId);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the order status in the local state
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderId ? { ...order, status: 'CANCELLED' } : order
            )
          );
          toast.success('Order cancelled successfully');
        } else {
          toast.error(data.message || 'Failed to cancel order');
        }
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling order');
    } finally {
      setCancellingOrder(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">
                Track and manage your vehicle rental orders
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => router.push('/vehicles')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Vehicles
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven&apos;t placed any orders yet. Start by browsing our
                available vehicles.
              </p>
              <button
                onClick={() => router.push('/vehicles')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Vehicles
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              statusColors[
                                order.status as keyof typeof statusColors
                              ]
                            }`}
                          >
                            {order.status}
                          </span>
                          {order.payments.length > 0 && (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                paymentStatusColors[
                                  order.payments[0]
                                    .status as keyof typeof paymentStatusColors
                                ]
                              }`}
                            >
                              Payment {order.payments[0].status.toLowerCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={
                              order.vehicle.imageUrl ||
                              '/placeholder-vehicle.jpg'
                            }
                            alt={order.vehicle.name}
                            className="w-full sm:w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            {order.vehicle.name}
                          </h4>
                          <p className="text-gray-600">
                            {order.vehicle.brand} {order.vehicle.model} •{' '}
                            {order.vehicle.type}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-500">
                                Pickup Date
                              </p>
                              <p className="font-medium">
                                {formatDate(order.pickupDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Pickup Location
                              </p>
                              <p className="font-medium">
                                {order.pickupLocation}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Rental Period
                              </p>
                              <p className="font-medium">
                                {formatDate(order.rental.startDate)} -{' '}
                                {formatDate(order.rental.endDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                (
                                {getRentalDuration(
                                  order.rental.startDate,
                                  order.rental.endDate
                                )}{' '}
                                days)
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Total Cost
                              </p>
                              <p className="font-medium text-lg">
                                NPR {order.totalCost.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  {order.payments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">
                        Payment Details
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Transaction ID</p>
                          <p className="font-medium">
                            {order.payments[0].transactionId}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-medium">
                            NPR {order.payments[0].amount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment Date</p>
                          <p className="font-medium">
                            {formatDateTime(order.payments[0].createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          router.push(`/vehicles/${order.vehicle.id}`)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        View Vehicle
                      </button>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrder === order.id}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                        >
                          {cancellingOrder === order.id
                            ? 'Cancelling...'
                            : 'Cancel Order'}
                        </button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Contact Support
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {orders.length}
                </div>
                <div className="text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {orders.filter((o) => o.status === 'PENDING').length}
                </div>
                <div className="text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {orders.filter((o) => o.status === 'COMPLETED').length}
                </div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">
                  NPR{' '}
                  {orders
                    .reduce((total, order) => total + order.totalCost, 0)
                    .toFixed(2)}
                </div>
                <div className="text-gray-600">Total Spent</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
