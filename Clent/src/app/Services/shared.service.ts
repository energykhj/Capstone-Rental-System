import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = 'http://localhost:57183/api';
  readonly PhotoUrl = 'http://localhost:57183/';

  constructor(private http:HttpClient) { }

  Login(val:any){
    return this.http.post(this.APIUrl+'/Authentication/Login',val)
  }

  CreateUser(val:any){
    return this.http.post(this.APIUrl+'/Authentication/CreateUser',val)
  }

  Register(val:any){
    return this.http.post(this.APIUrl+'/Authentication/Register',val)
  }

  GetUserxx(val:string){
    return this.http.get<User>(`${environment.apiUrl}/UserDetails/GetUser/`+val);
  }
  GetUser(val:any){
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/`+val);
  }
  GetWeather():Observable<any[]>{
    return this.http.get<any>(`${environment.apiUrl}/weatherforecast`);
  }

  getProvinces():Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/Lookup/GetProvinces`);
  }

  UpdateUser(val:any){

    console.log("id: " + val.id);
    console.log("first: " + val.firstName);
console.log("last: " + val.lastName);
console.log("phone: " + val.phone);
console.log("address1: " + val.address1);
console.log("address2: " + val.address2);
console.log("province: " + val.provinceId);
console.log("province2: " + val.province2);
console.log("PostalCode: " + val.postalCode);
console.log("photoUrl: " + val.photoUrl);
console.log("val: " + val);

    return this.http.put<any>(`${environment.apiUrl}/UserDetails/UpdateUser`, val);
}

  uploadPhoto(val:any){
    return this.http.post(`${environment.apiUrl}/UserDetails/SavePhoto`, val)
  }

  uploadPhoto1(file: FormData):Observable<any>{
    const url = `${environment.apiUrl}/UserDetails/SavePhoto`
    return this.http.post(`${environment.apiUrl}/UserDetails/SavePhoto`, file)
  }

  upload(file: any) {
    let input = new FormData();
    input.append("filesData", file);
    return this.http.post(`${environment.apiUrl}/UserDetails/SavePhoto`, input)
}

  get isLoginUser() {
    return localStorage.getItem("userId");
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
}
