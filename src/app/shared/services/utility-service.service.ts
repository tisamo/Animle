import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {query} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {

  createQueryString(queryParamObject: any){
    const keys = Object.keys(queryParamObject);
    let queryString = '?';
    keys.forEach((k,i)=>{
      if(i!=0){
        queryString = queryString+'&';
      }
      queryString = `${queryString}${k}=${queryParamObject[k]}`;
    })
    return queryString;
  }
}
