import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const generatePaymentData = (total_amount: number) => {
  const transaction_uuid = uuidv4();

  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;

  const hash = CryptoJS.HmacSHA256(message, '8gBm/:&EnhH.1/q');
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return {
    transaction_uuid,
    hashInBase64,
  };
};

const getDecodeToken = (token: string) => {
  const decoded = CryptoJS.enc.Base64.parse(token);
  const data = CryptoJS.enc.Utf8.stringify(decoded);

  return JSON.parse(data);
};
export { generatePaymentData, getDecodeToken };
