import CryptoJS from "crypto-js";

// pnpm i @types/crypto-js --save-dev
// pnpm install crypto-js 

export const secretKey = {
  "AES_PWD_SECRET_KEY": "KOIADMINyuxintao"
}

// 加密
export function encrypt(data: any, key: any) {
  const secretKey = CryptoJS.enc.Utf8.parse(key);
  const encryptData = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(encryptData, secretKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

// 解密
export function decrypt(data: any, key: any) {
  const secretKey = CryptoJS.enc.Utf8.parse(key);
  const decrypt = CryptoJS.AES.decrypt(data, secretKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
