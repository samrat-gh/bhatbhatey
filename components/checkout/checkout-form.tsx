'use client';

import { Calendar, Car, FileText, MapPin, Shield } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface CheckoutFormProps {
  vehicle: Vehicle;
}

export default function CheckoutForm({ vehicle }: CheckoutFormProps) {
  const [pickupDate, setPickupDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptGuidelines, setAcceptGuidelines] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti'>(
    'esewa'
  );

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Calculate total cost
  const totalCost = vehicle.costPerDay * rentalDays;
  const serviceFee = totalCost * 0.1; // 10% service fee
  const taxes = totalCost * 0.05; // 5% taxes
  const finalTotal = totalCost + serviceFee + taxes;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      setPickupDate(e.target.value);
    }
  };

  const handleCheckout = async () => {
    if (!pickupDate || !pickupLocation || !acceptTerms || !acceptGuidelines) {
      alert(
        'Please fill in all required fields and accept the terms and guidelines.'
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 1) Create order first
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          pickupDate,
          pickupLocation,
          rentalDays,
        }),
      });
      const result = await response.json();

      if (!result?.success) {
        alert(`Error: ${result?.message || 'Failed to create order'}`);
        setIsProcessing(false);
        return;
      }

      const orderId: string | undefined = result?.data?.order?.id;
      // Normalize to whole-rupee string to avoid float precision mismatches
      const amountStr = Math.round(finalTotal).toString();

      // 2) Initiate selected payment session
      const paymentRes = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: paymentMethod,
          amount: amountStr,
          productName: vehicle.name,
          transactionId: orderId || `${vehicle.slug}-${Date.now()}`,
        }),
      });

      if (!paymentRes.ok) {
        const err = await paymentRes.json().catch(() => ({}));
        alert(`Payment init failed: ${err?.details || paymentRes.statusText}`);
        setIsProcessing(false);
        return;
      }
      const paymentData = await paymentRes.json();

      if (paymentMethod === 'khalti') {
        const url = paymentData?.khaltiPaymentUrl as string | undefined;
        if (!url) {
          alert('Khalti payment URL not received');
          setIsProcessing(false);
          return;
        }
        window.location.href = url;
        return;
      }

      // eSewa: Auto-submit form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

      const esewaPayload: Record<string, string | number> = {
        amount: paymentData.amount,
        tax_amount: paymentData.esewaConfig.tax_amount,
        total_amount: paymentData.esewaConfig.total_amount,
        transaction_uuid: paymentData.esewaConfig.transaction_uuid,
        product_code: paymentData.esewaConfig.product_code,
        product_service_charge: paymentData.esewaConfig.product_service_charge,
        product_delivery_charge:
          paymentData.esewaConfig.product_delivery_charge,
        success_url: paymentData.esewaConfig.success_url,
        failure_url: paymentData.esewaConfig.failure_url,
        signed_field_names: paymentData.esewaConfig.signed_field_names,
        signature: paymentData.esewaConfig.signature,
      };

      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      alert('An error occurred while processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const guidelines = [
    'Valid driving license is required for all rentals',
    'Vehicle must be returned with the same fuel level',
    'Any damages will be charged according to our damage policy',
    'Late returns will incur additional charges',
    'Vehicle is covered by our comprehensive insurance',
    'No smoking or pets allowed in the vehicle',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            Review your selection and complete the checkout process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                    <p className="text-gray-600">
                      {vehicle.brand} • {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{vehicle.type}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600">
                        Mileage: {vehicle.mileage} km/L
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{vehicle.costPerDay}/day
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={pickupDate}
                      min={today}
                      onChange={handleDateChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rentalDays">Rental Duration (Days)</Label>
                    <Input
                      id="rentalDays"
                      type="number"
                      value={rentalDays}
                      min="1"
                      max="30"
                      onChange={(e) =>
                        setRentalDays(parseInt(e.target.value) || 1)
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="pickupLocation"
                      type="text"
                      placeholder="Enter pickup address"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rental Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{guideline}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptGuidelines"
                      checked={acceptGuidelines}
                      onChange={(e) =>
                        setAcceptGuidelines(
                          (e.target as HTMLInputElement).checked
                        )
                      }
                    />
                    <label
                      htmlFor="acceptGuidelines"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      I have read and accept the rental guidelines
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) =>
                        setAcceptTerms((e.target as HTMLInputElement).checked)
                      }
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Choose Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-3">
                  <Button
                    type="button"
                    variant={paymentMethod === 'esewa' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('esewa')}
                  >
                    eSewa
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'khalti' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('khalti')}
                  >
                    Khalti
                  </Button>
                </div>
                <div
                  className="mt-1 p-3 rounded-lg border"
                  style={{
                    borderColor:
                      paymentMethod === 'esewa' ? '#bbf7d0' : '#bfdbfe',
                    background:
                      paymentMethod === 'esewa' ? '#f0fdf4' : '#eff6ff',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Shield
                      className={`h-4 w-4 ${
                        paymentMethod === 'esewa'
                          ? 'text-green-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {paymentMethod === 'esewa'
                        ? 'You will be redirected to eSewa to complete your payment.'
                        : 'You will be redirected to Khalti to complete your payment.'}
                    </span>
                  </div>
                  <p className="text-xs mt-1">
                    We don’t store any payment credentials. After payment,
                    you&apos;ll be redirected to the confirmation page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Rental ({rentalDays} day{rentalDays > 1 ? 's' : ''})
                    </span>
                    <span>₹{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>₹{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>₹{taxes.toLocaleString()}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {pickupDate && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">
                      Pickup Details
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Date: {new Date(pickupDate).toLocaleDateString()}
                    </p>
                    {pickupLocation && (
                      <p className="text-sm text-gray-600">
                        Location: {pickupLocation}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  disabled={
                    !pickupDate ||
                    !pickupLocation ||
                    !acceptTerms ||
                    !acceptGuidelines ||
                    isProcessing
                  }
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Pay with ${paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} - ₹${finalTotal.toLocaleString()}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By completing this booking, you agree to our rental terms and
                  conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
