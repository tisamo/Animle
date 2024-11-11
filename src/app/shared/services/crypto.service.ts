import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  key = CryptoJS.enc.Base64.parse('LO4Q66vru8G+SCcq91o9ug==');  // Use Base64 parse if the key is Base64 encoded
  iv = CryptoJS.enc.Utf8.parse('05c82cfff596fb85');  // Ensure this is exactly 16 bytes for AES

    decryptData(encryptedData: string | undefined): any {
    if(!encryptedData) return;
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedText;
  }
}
