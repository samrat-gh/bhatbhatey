'use server';

import { NextResponse } from 'next/server';

import { generatePaymentData } from '@/lib/generate-esewa-signature';
import { PaymentMethod, PaymentRequestData } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const paymentData: PaymentRequestData = await req.json();
    const { amount, productName, transactionId, method } = paymentData;
    const requestOrigin = (() => {
      try {
        return new URL(req.url).origin;
      } catch {
        return undefined;
      }
    })();
    if (!amount || !productName || !transactionId || !method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    switch (method as PaymentMethod) {
      case 'esewa': {
        // Validate required envs for eSewa
        const esewaMerchant = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE;
        const esewaSecret = process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY;
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.NEXT_PUBLIC_HOST_URL ||
          requestOrigin ||
          (process.env.NODE_ENV !== 'production'
            ? 'http://localhost:3000'
            : undefined);
        if (!esewaMerchant) {
          const msg =
            'Missing environment variable: NEXT_PUBLIC_ESEWA_MERCHANT_CODE';
          throw new Error(msg);
        }
        if (!esewaSecret) {
          const msg =
            'Missing environment variable: NEXT_PUBLIC_ESEWA_SECRET_KEY';
          throw new Error(msg);
        }
        if (!baseUrl) {
          const msg =
            'Missing environment variable: NEXT_PUBLIC_BASE_URL or NEXT_PUBLIC_HOST_URL';
          throw new Error(msg);
        }
        const esewaConfig = {
          amount: amount,
          tax_amount: '0',
          total_amount: amount,
          product_code: esewaMerchant,
          product_service_charge: '0',
          product_delivery_charge: '0',
          // Redirect back to our app on success/failure
          success_url: `${baseUrl}/orders/success?method=esewa`,
          failure_url: `${baseUrl}/orders/failed`,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
        };

        // const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const encryptedData = generatePaymentData(
          Number(esewaConfig.total_amount)
        );
        const signature = encryptedData.hashInBase64;
        const transaction_uuid = encryptedData.transaction_uuid;

        console.log('esewa res', {
          amount: String(amount),
          esewaConfig: {
            ...esewaConfig,
            signature: String(signature),
            transaction_uuid: transaction_uuid,

            // Keep all values as strings to ensure exact match with signature
            product_service_charge: String(esewaConfig.product_service_charge),
            product_delivery_charge: String(
              esewaConfig.product_delivery_charge
            ),
            tax_amount: String(esewaConfig.tax_amount),
            total_amount: String(esewaConfig.total_amount),
          },
          // Debug only: compare this to your posted values if ES104 persists
          debug:
            process.env.NODE_ENV !== 'production' ? { signature } : undefined,
        });

        return NextResponse.json({
          amount: String(amount),
          esewaConfig: {
            ...esewaConfig,
            signature: String(signature),
            transaction_uuid: transaction_uuid,

            // Keep all values as strings to ensure exact match with signature
            product_service_charge: String(esewaConfig.product_service_charge),
            product_delivery_charge: String(
              esewaConfig.product_delivery_charge
            ),
            tax_amount: String(esewaConfig.tax_amount),
            total_amount: String(esewaConfig.total_amount),
          },
          // Debug only: compare this to your posted values if ES104 persists
          debug:
            process.env.NODE_ENV !== 'production' ? { signature } : undefined,
        });
      }
      case 'khalti': {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.NEXT_PUBLIC_HOST_URL ||
          requestOrigin ||
          (process.env.NODE_ENV !== 'production'
            ? 'http://localhost:3000'
            : undefined);
        const khaltiSecret = process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY;
        if (!baseUrl) {
          const msg =
            'Missing environment variable: NEXT_PUBLIC_BASE_URL or NEXT_PUBLIC_HOST_URL';
          throw new Error(msg);
        }
        if (!khaltiSecret) {
          const msg =
            'Missing environment variable: NEXT_PUBLIC_KHALTI_SECRET_KEY';
          throw new Error(msg);
        }
        const khaltiConfig = {
          return_url: `${baseUrl}/orders/success?method=khalti`,
          website_url: baseUrl!,
          amount: Math.round(parseFloat(amount) * 100),
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: 'dai',
            email: 'dai@gmail.com',
            phone: '9800000000',
          },
        };
        const response = await fetch(
          'https://a.khalti.com/api/v2/epayment/initiate/',
          {
            method: 'POST',
            headers: {
              Authorization: `Key ${khaltiSecret}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(khaltiConfig),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Khalti payment initiation failed: ${JSON.stringify(errorData)}`
          );
        }
        const khaltiResponse = await response.json();
        return NextResponse.json({
          khaltiPaymentUrl: khaltiResponse.payment_url,
        });
      }
      default:
        return NextResponse.json(
          { error: 'Invalid payment method' },
          { status: 400 }
        );
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Error creating payment session',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
