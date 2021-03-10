import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertsComponent } from 'src/app/DOM/Shared/alerts/alerts.component';
import { MatDialog } from '@angular/material/dialog';
// import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly APIUrl = 'http://localhost:57183/api';
  readonly PhotoUrl = 'http://localhost:57183/';
  readonly PhotoUrlAvatar = 'http://localhost:57183/api/UserDetails/GetAvatar/';

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  Login(val: any) {
    return this.http.post(this.APIUrl + '/Authentication/Login', val);
  }

  CreateUser(val: any) {
    return this.http.post(this.APIUrl + '/Authentication/CreateUser', val);
  }

  Register(val: any) {
    return this.http.post(this.APIUrl + '/Authentication/Register', val);
  }

  public get GetUserInfo() {
    var id = this.isLoginUser.replace(/['"]+/g, '');
    if (!id) return;
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/` + id);
  }

  public GetOwnerInfo(id: string) {
    if (!id) return;
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/` + id);
  }

  GetWeather(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/weatherforecast`);
  }

  getProvinces(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Lookup/GetProvinces`);
  }

  updateUser(val: any) {
    //alert(val.details.statusId);
    if (val.details.statusId == 0) {
      return this.http.post<any>(`${environment.apiUrl}/UserDetails/CreateUser`, val);
    } else {
      return this.http.put<any>(`${environment.apiUrl}/UserDetails/UpdateUser`, val);
    }
  }

  uploadPhoto(val: any) {
    return this.http.post(`${environment.apiUrl}/UserDetails/SaveAvatar`, val);
  }

  upload(file: any) {
    let input = new FormData();
    input.append('filesData', file);
    return this.http.post(`${environment.apiUrl}/UserDetails/SavePhoto`, input);
  }

  get isLoginUser() {
    return localStorage.getItem('userId');
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Lookup/GetCategories`);
  }

  insertItem(val: any) {
    return this.http.post<any>(`${environment.apiUrl}/Item`, val);
  }

  uploadItemPhoto(val: any) {
    return this.http.post(`${environment.apiUrl}/Item/SavePhotos`, val);
  }

  getItem(val: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Item/GetItem/` + val);
  }

  getUserItem(page: any, val: any) {
    return this.http.get<any>(`${environment.apiUrl}/Item/GetUserItemsAndDefaultPhoto/` + page + '/' + val);
  }

  updateItem(val: any) {
    return this.http.put<any>(`${environment.apiUrl}/Item`, val);
  }

  // Item List //Need to change Name
  // GetItem(val:any,page:any){
  //   let va = 'http://localhost:49730/api/Item/'+val+'/'+page;
  //   console.log(va);
  //   return this.http.get<any>('http://localhost:49730/api/Item/'+val+'/'+page);
  // }

  getSearchedItemAndDefaultPhoto(page: any, val: any) {
    return this.http.get<any>(`${environment.apiUrl}/Item/GetSearchedItemAndDefaultPhoto/` + page + '/' + val);
  }

  getItemPhotos(val: any) {
    return this.http.get<any>(`${environment.apiUrl}/Item/GetItemPhotos/` + val);
  }

  getItemPhotoFile(val: any): Observable<any> {
    return this.http.get(`${environment.PhotoFileUrl}` + val, { responseType: 'blob' });
  }

  getAllBoardArticles() {
    return this.http.get<any>(`${environment.apiUrl}/AskBoard`);
  }

  GetItemByStatus(val: any, status: any) {
    //let head = new Headers({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('userId', val).set('statusIds', status.join(','));
    return this.http.get<any>(`${environment.apiUrl}/Transaction`, { params: params });
  }

  insertTransaction(transPkg: any) {
    return this.http.post<any>(`${environment.apiUrl}/Transaction`, transPkg);
  }

  putTransactionDetail(tDetail: any) {
    return this.http.put<any>(`${environment.apiUrl}/Transaction`, tDetail);
  }

  Alert(t: string, m: string): void {
    const timeout = 2000;
    const dialogRef = this.dialog.open(AlertsComponent, {
      width: '360px',
      data: { type: t, msg: m },
    });
    dialogRef.afterOpened().subscribe((_) => {
      if (t != 'danger') {
        setTimeout(() => {
          dialogRef.close();
        }, timeout);
      }
    });
  }
}
