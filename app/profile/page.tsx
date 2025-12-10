'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  _count: {
    orders: number;
    rentals: number;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    phone: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);

        // Get token from cookies
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProfile(data.user);
            setEditedProfile({
              name: data.user.name,
              phone: data.user.phone,
            });
          } else {
            toast.error('Failed to fetch profile');
          }
        } else {
          toast.error('Failed to fetch profile');
        }
      } catch (error) {
        toast.error('An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleEdit = () => {
    if (profile) {
      setEditedProfile({
        name: profile.name,
        phone: profile.phone,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editedProfile.name.trim() || !editedProfile.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editedProfile.name.trim(),
          phone: editedProfile.phone.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.user);
          setIsEditing(false);
          toast.success('Profile updated successfully!');
        } else {
          toast.error(data.message || 'Failed to update profile');
        }
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({
        name: profile.name,
        phone: profile.phone,
      });
    }
    setIsEditing(false);
  };

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

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile not found
          </h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>

          {/* Profile Section */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="sm:ml-6 text-center sm:text-left mt-4 sm:mt-0 flex-1">
                {!isEditing ? (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.name}
                    </h1>
                    <p className="text-gray-600">{profile.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Member since {joinDate}
                    </p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
                      placeholder="Your Name"
                      disabled={updating}
                    />
                    <p className="text-gray-600">{profile.email}</p>
                    <p className="text-sm text-gray-500">
                      Member since {joinDate}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      disabled={updating}
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                      disabled={updating}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {!isEditing ? (
                  <p className="text-gray-900">{profile.phone}</p>
                ) : (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="Your phone number"
                    disabled={updating}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{profile.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold text-blue-600">
                  {profile._count.orders}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Rentals</span>
                <span className="font-semibold text-green-600">
                  {profile._count.rentals}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Status</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/vehicles')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="text-lg font-medium text-gray-900">
                Browse Vehicles
              </div>
              <div className="text-sm text-gray-600">Find your next ride</div>
            </button>
            <button
              onClick={() => router.push('/orders')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="text-lg font-medium text-gray-900">My Orders</div>
              <div className="text-sm text-gray-600">View order history</div>
            </button>
            <button
              onClick={() => router.push('/')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="text-lg font-medium text-gray-900">Home</div>
              <div className="text-sm text-gray-600">Back to homepage</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
