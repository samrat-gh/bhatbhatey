import crypto from 'crypto';

export function generateEsewaSignature(
  secretKey: string,
  message: string
): string {
  return crypto
    .createHmac('sha256', secretKey)
    .update(message, 'utf8')
    .digest('base64');
}
