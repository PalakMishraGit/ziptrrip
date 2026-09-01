import crypto from 'crypto';

export function cryptoRandomString(length = 8) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}
