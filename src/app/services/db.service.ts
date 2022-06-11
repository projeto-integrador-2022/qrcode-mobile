import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Qr } from '../models/qr.model';
import { Custumer } from '../models/custumer.model';

@Injectable({
    providedIn: 'root'
})
export class DbService {
    qrEndpoint = 'https://20.226.8.18/qrcode';

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    getQr(uuid: number): Observable<Qr> {
        return this.http
            .get<Qr>(this.qrEndpoint + '/' + uuid)
            .pipe(
                retry(2),
                catchError(this.handleError)
            );
    }

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    };
}