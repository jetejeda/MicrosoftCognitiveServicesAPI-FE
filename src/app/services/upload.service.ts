import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  sendImages(data: any): Observable<any>{

    return this.http.post(environment.sendImage, data).pipe(
      map(res => {
        return res;
      }),
      catchError(err => {
        return throwError(err);
      })
    )
  }
}
