'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// NOTE: Server returns all numeric-looking values as strings (needed for signature integrity)
interface EsewaConfig {
  amount?: string; // present on server internal object, we rely on top-level amount for posting
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string; // eSewa expects exactly the fields used to build signature, comma separated
  signature: string;
}

interface PaymentResponse {
  amount: string; // echo of requested amount
  esewaConfig: EsewaConfig;
  debug?: { signatureString: string };
  error?: string;
}

export default function EsewaPayment() {
  const [amount, setAmount] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'esewa',
          amount,
          productName,
          transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment initiation failed: ${response.statusText}`);
      }

      const paymentData: PaymentResponse = await response.json();
      if (paymentData.error) {
        throw new Error(paymentData.error);
      }
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[eSewa] Payment Data (raw):', paymentData);
        if (paymentData.debug) {
          // eslint-disable-next-line no-console
          console.log(
            '[eSewa] Signature String Used:',
            paymentData.debug.signatureString
          );
        }
      }
      toast.success('Payment Initiated', {
        description: 'Redirecting to eSewa payment gateway...',
      });
      // Build and submit eSewa form (safer encapsulated helper)
      buildAndSubmitEsewaForm(paymentData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Payment error:', errorMessage);
      }
      setError('Payment initiation failed. Please try again.');
      toast.error('Payment Error', {
        description: 'Payment initiation failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>eSewa Payment</CardTitle>
          <CardDescription>Enter payment details for eSewa</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NPR)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                placeholder="Enter product name"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                placeholder="Enter transaction ID"
                maxLength={50}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !amount || !productName || !transactionId}
            >
              {isLoading ? 'Processing...' : 'Pay with eSewa'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// --- Helper Functions (file-local) --- //
function buildAndSubmitEsewaForm(paymentData: PaymentResponse) {
  const { esewaConfig, amount } = paymentData;
  console.log(esewaConfig);
  // Basic runtime validation before attempting submission
  const requiredFields: Array<[string, string | undefined]> = [
    ['amount', amount],
    ['tax_amount', esewaConfig.tax_amount],
    ['total_amount', esewaConfig.total_amount],
    ['transaction_uuid', esewaConfig.transaction_uuid],
    ['product_code', esewaConfig.product_code],
    ['product_service_charge', esewaConfig.product_service_charge],
    ['product_delivery_charge', esewaConfig.product_delivery_charge],
    ['success_url', esewaConfig.success_url],
    ['failure_url', esewaConfig.failure_url],
    ['signed_field_names', esewaConfig.signed_field_names],
    ['signature', esewaConfig.signature],
  ];

  const missing = requiredFields.filter(([, v]) => v == null || v === '');
  if (missing.length) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(
        '[eSewa] Missing required fields for form submission:',
        missing.map(([k]) => k)
      );
    }
    throw new Error(
      'Missing eSewa form fields: ' + missing.map(([k]) => k).join(',')
    );
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
  form.style.display = 'none';
  form.setAttribute('accept-charset', 'UTF-8');

  const esewaPayload: Record<string, string> = {
    amount: String(amount),
    tax_amount: esewaConfig.tax_amount,
    total_amount: esewaConfig.total_amount,
    transaction_uuid: esewaConfig.transaction_uuid,
    product_code: esewaConfig.product_code,
    product_service_charge: esewaConfig.product_service_charge,
    product_delivery_charge: esewaConfig.product_delivery_charge,
    success_url: esewaConfig.success_url,
    failure_url: esewaConfig.failure_url,
    signed_field_names: esewaConfig.signed_field_names,
    signature: esewaConfig.signature,
  };

  console.log(esewaPayload);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.group('[eSewa] Preparing form submission');
    // eslint-disable-next-line no-console
    console.table(esewaPayload);
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  Object.entries(esewaPayload).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  try {
    form.submit();
  } finally {
    // Delay removal a tick in case immediate removal interferes in some browsers
    setTimeout(() => {
      if (form.parentNode) form.parentNode.removeChild(form);
    }, 2000);
  }
}
