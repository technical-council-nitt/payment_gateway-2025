// /lib/crypto.js

import crypto from 'crypto';

/**
 * Generates an HMAC SHA256 signature and encodes it in Base64.
 *
 * @param {string} clientSecret - Your secret key for signing.
 * @param {string} jsonData - The raw JSON string payload to sign.
 * @returns {string|null} The Base64 encoded HMAC signature, or null on error.
 */
export function generateHmacSignature(clientSecret, jsonData) {
  try {
    const dataObject = JSON.parse(jsonData);
    const sortedKeys = Object.keys(dataObject).sort();
    const postDataString = sortedKeys.map(key => dataObject[key]).join('');

    const hmac = crypto.createHmac('sha256', clientSecret);
    hmac.update(postDataString);
    
    const signature = hmac.digest('base64');
    return signature;

  } catch (error) {
    console.error("Error generating HMAC signature:", error);
    return null;
  }
}