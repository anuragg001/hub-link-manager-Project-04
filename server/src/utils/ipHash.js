import crypto from 'crypto';
import env from '../config/env.js';

export const hashIp = (ip) => {
  if (!ip) return null;
  return crypto.createHmac('sha256', env.IP_HASH_SECRET).update(ip).digest('hex');
};