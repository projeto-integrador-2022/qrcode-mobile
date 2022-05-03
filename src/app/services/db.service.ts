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
    qrendpoint = 'http://localhost:4203/qr';
    custumerendpoint = 'http://localhost:4204/custumer';

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    getQrList(): Observable<Qr[]> {
        return this.http
            .get<Qr[]>(this.qrendpoint)
            .pipe(
                retry(2),
                catchError(this.handleError)
            );
    }

    getQr(id: number): Observable<Qr> {
        return this.http
            .get<Qr>(this.qrendpoint + '/' + id)
            .pipe(
                retry(2),
                catchError(this.handleError)
            );
    }

    saveUserData(custumer:Custumer ) {
        return this.http
            .post(this.custumerendpoint, custumer, this.httpOptions)
            .pipe(
                retry(2),
                catchError(this.handleError)
            );
    }

    updateUserData(custumer:Custumer ) {
        return this.http
            .put(this.custumerendpoint, custumer, this.httpOptions)
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