/**
 * Encryption Utilities
 * Implements AES-256-CBC encryption for capsule content
 * Uses Node.js crypto module for secure encryption/decryption
 */

import crypto from 'crypto';

// AES-256 requires a 32-byte key
const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

/**
 * Gets the encryption key from environment or generates a default
 * In production, always use a secure, randomly generated key
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-prod!!';
  
  // Ensure key is exactly 32 bytes
  if (key.length < KEY_LENGTH) {
    return Buffer.from(key.padEnd(KEY_LENGTH, '0'));
  }
  
  return Buffer.from(key.slice(0, KEY_LENGTH));
}

/**
 * Encrypts content using AES-256-CBC
 * @param text - Plain text content to encrypt
 * @returns Encrypted content in format: iv:encryptedData (hex encoded)
 */
export function encrypt(text: string): string {
  try {
    // Generate random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getEncryptionKey();
    
    // Create cipher and encrypt
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data (we need IV for decryption)
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt content');
  }
}

/**
 * Decrypts content encrypted with AES-256-CBC
 * @param encryptedText - Encrypted content in format: iv:encryptedData
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  try {
    // Split IV and encrypted data
    const [ivHex, encryptedData] = encryptedText.split(':');
    
    if (!ivHex || !encryptedData) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const key = getEncryptionKey();
    
    // Create decipher and decrypt
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt content');
  }
}
