import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../Models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    CreateUser(val:any){  
        //return this.http.post(environment.apiUrl+'/Authentication/CreateUser',val)
        return this.http.post<any>(`${environment.apiUrl}/Authentication/CreateUser`, val)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            const test = (<any>user).userId;
            localStorage.setItem('currentUser', JSON.stringify(user));
            //localStorage.setItem('userId', JSON.stringify(val.Email));
            localStorage.setItem('jwt', JSON.stringify(user.token));
            localStorage.setItem('userId', JSON.stringify(test));
            this.currentUserSubject.next(user);
            return user;
        }));
        // localStorage.setItem("jwt", token);
        // localStorage.setItem("userId", val.Email);
    }

  
    GetUser(id:string):Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/${id}`); 
      }
    
    Login(Email:string, Password:string) {  
        return this.http.post<any>(`${environment.apiUrl}/Authentication/Login`, { Email, Password})
            .pipe(map(user => {
                const test = (<any>user).userId;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                //localStorage.setItem('userId', JSON.stringify(Email));
                localStorage.setItem('jwt', JSON.stringify(user.token));
                localStorage.setItem('userId', JSON.stringify(test));
                this.currentUserSubject.next(user);
                return user;
            }));
    }   

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}