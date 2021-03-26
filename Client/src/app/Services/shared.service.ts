import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AlertsComponent } from 'src/app/DOM/Shared/alerts/alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { map, catchError } from 'rxjs/operators';
// import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  public get getUserInfo() {
    var id = this.isLoginUser.replace(/['"]+/g, '');
    if (!id) return;
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/` + id);
  }

  public getOwnerInfo(id: string) {
    if (!id) return;
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/` + id);
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

  getItemByStatus(val: any, status: any) {
    const params = new HttpParams().set('userId', val).set('statusIds', status.join(','));
    return this.http.get<any>(`${environment.apiUrl}/Transaction`, { params: params });
  }

  getTransactionByUser(val: any, status: any) {
    const params = new HttpParams().set('userId', val).set('statusIds', status.join(','));
    return this.http.get<any>(`${environment.apiUrl}/Transaction/GetTransactionByUser`, { params: params });
  }

  insertTransaction(transPkg: any) {
    return this.http.post<any>(`${environment.apiUrl}/Transaction`, transPkg);
  }

  updateTransaction(transPkg: any) {
    return this.http.put<any>(`${environment.apiUrl}/Transaction/UpdateTransaction`, transPkg);
  }

  putTransactionDetail(tDetail: any) {
    return this.http.put<any>(`${environment.apiUrl}/Transaction/InsertTransactionDetails`, tDetail);
  }

  getItemBorrowedDate(itemId: string) {
    return this.http.get<any>(`${environment.apiUrl}/Transaction/getItemBorrowedDate?itemId=${itemId}`);
  }

  insertNotification(notification: any) {
    return this.http.post<any>(`${environment.apiUrl}/Notification/InsertNotification`, notification);
  }

  getNotification(val: any, startDate: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/Notification/getNotification?userId=${val}&startDate=${startDate}`
    );
  }

  updateNotificationStatus(val: any) {
    return this.http.put<any>(`${environment.apiUrl}/Notification/UpdateNotificationStatus?notiId=${val}`, '');
  }

  manageCategory(val: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Admin/ManageCategory/`, val);
  }

  //type: success, info, warning, danger
  alert(t: string, m: string): void {
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

  private subject = new Subject<any>();

  sendNotificationCount(count: number) {
    this.subject.next(count);
  }

  clearNotificationCount() {
    this.subject.next();
  }

  getNotificationCount(): Observable<any> {
    return this.subject.asObservable();
  }
}
