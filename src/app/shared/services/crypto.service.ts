import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
   decodeData(base64: string) {
     const decodedData = atob(base64);
     return JSON.parse(decodedData);
   }
}
