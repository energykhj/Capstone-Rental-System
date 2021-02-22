import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = 'http://localhost:57183/api';
  readonly PhotoUrl = 'http://localhost:57183/';
  readonly PhotoUrlAvatar = 'http://localhost:57183/api/UserDetails/GetAvatar/';

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
 
  public get GetUserInfo(){   
    var id = this.isLoginUser.replace(/['"]+/g, ''); 
    if(!id) return;    
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/`+ id);
  }

  GetUserxxx(val:any){
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/`+val);
  }
  GetWeather():Observable<any[]>{
    return this.http.get<any>(`${environment.apiUrl}/weatherforecast`);
  }

  getProvinces():Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/Lookup/GetProvinces`);
  }

  UpdateUser(val:any){

    console.log("id: " + val.details.id);
    console.log("email: " + val.details.email);
    console.log("first: " + val.details.firstName);
    console.log("last: " + val.details.lastName);
    console.log("photoUrl: " + val.details.photoUrl);
    console.log("phone: " + val.details.phone);
    console.log("statusId: " + val.details.statusId);
    console.log("userId: " + val.address.userId);
    console.log("isDefault: " + val.address.isDefault);
    console.log("address1: " + val.address.address1);
    console.log("address2: " + val.address.address2);
    console.log("city: " + val.address.city);
    console.log("provinceId: " + val.address.provinceId);
    console.log("val: " + val);

    alert(val.details.statusId);
    if(val.details.statusId == 0){
      return this.http.post<any>(`${environment.apiUrl}/UserDetails/CreateUser`, val);
    }
    else{
      return this.http.put<any>(`${environment.apiUrl}/UserDetails/UpdateUser`, val);
    }
  }

  uploadPhoto(val:any){
    return this.http.post(`${environment.apiUrl}/UserDetails/SaveAvatar`, val)
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

  getCategories():Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/Lookup/GetCategories`);
  }

  insertItem(val:any) {
    return this.http.post<any>(`${environment.apiUrl}/Item`, val);
  }

  uploadItemPhoto(val:any){
    return this.http.post(`${environment.apiUrl}/Item/SavePhotos`, val)
  }

  getItem(val:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/Item/GetItem/` + val);
  }

  updateItem(val:any){
    return this.http.put<any>(`${environment.apiUrl}/Item`, val);
  }

  // Item List
  GetItem(val:any,page:any){
    let va = 'http://localhost:49730/api/Item/'+val+'/'+page;
    console.log(va);
    return this.http.get<any>('http://localhost:49730/api/Item/'+val+'/'+page);
  }

  GetSearchedItemAndDefaultPhoto(page:any,val:any){
    return this.http.get<any>(`${environment.apiUrl}/Item/GetSearchedItemAndDefaultPhoto/`+ page+'/'+val);
  }

  GetItemPhotos(val:any){
    return this.http.get<any>(`${environment.apiUrl}/Item/GetItemPhotos/`+ val);
  }

  getItemPhotoFile(val:any):Observable<any>{
    return this.http.get(`${environment.PhotoFileUrl}`+val, {responseType: 'blob'});
  }
}


