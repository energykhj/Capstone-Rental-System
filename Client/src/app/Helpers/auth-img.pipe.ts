import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'authImg',
})
export class AuthImgPipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  async transform(src: string): Promise<string> {
    //Get Token data from local storage
    //let tokenInfo = JSON.parse(localStorage.getItem('TokenInfo'));

    //if (tokenInfo && tokenInfo.token) {
    //  const headers = new HttpHeaders({'Authorization': `Bearer ${tokenInfo.token}`});
    //  const imageBlob = await this.http.get(src, {headers, responseType: 'blob'}).toPromise();
    const imageBlob = await this.http.get(src, { responseType: 'blob' }).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        var url = reader.result as string;
        let saftUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        return resolve(saftUrl as string);
      };
      reader.readAsDataURL(imageBlob);
    });
    //}
  }
}
