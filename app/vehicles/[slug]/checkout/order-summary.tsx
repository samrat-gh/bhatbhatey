import { useMemo } from 'react';

import { generatePaymentData } from '@/lib/generate-esewa-signature';

export default function OrderSummary({
  amount,
  children,
}: {
  amount: number;
  children: React.ReactNode;
}) {
  const { transaction_uuid, hashInBase64 } = useMemo(
    () => generatePaymentData(amount),
    [amount]
  );

  return (
    <>
      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        className="flex flex-col gap-1"
      >
        <input
          type="text"
          id="amount"
          name="amount"
          value={amount}
          required
          readOnly
          hidden
        />
        <input
          type="text"
          id="tax_amount"
          name="tax_amount"
          value="0"
          required
          readOnly
          hidden
        />
        <input
          type="text"
          id="total_amount"
          name="total_amount"
          value={amount}
          required
          readOnly
          hidden
        />
        <input
          type="text"
          id="transaction_uuid"
          name="transaction_uuid"
          value={transaction_uuid}
          readOnly
          hidden
          required
        />
        <input
          type="text"
          id="product_code"
          name="product_code"
          value="EPAYTEST"
          readOnly
          hidden
          required
        />
        <input
          type="text"
          id="product_service_charge"
          name="product_service_charge"
          value="0"
          readOnly
          hidden
          required
        />
        <input
          type="text"
          id="product_delivery_charge"
          name="product_delivery_charge"
          value="0"
          required
          readOnly
          hidden
        />
        <input
          type="text"
          id="success_url"
          name="success_url"
          value="http://localhost:3000/orders/success"
          required
          readOnly
          hidden
        />
        <input
          type="text"
          id="failure_url"
          name="failure_url"
          value="http://localhost:3000/orders/failed"
          required
          readOnly
          hidden
        />
        <input
          type="text"
          id="signed_field_names"
          name="signed_field_names"
          value="total_amount,transaction_uuid,product_code"
          required
          readOnly
          hidden
        />
        <input
          type="text"
          id="signature"
          name="signature"
          value={hashInBase64}
          required
          readOnly
          hidden
        />
        {children}
      </form>
    </>
  );
}
