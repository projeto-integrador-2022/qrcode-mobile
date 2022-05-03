import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class VisitorServices {
    ip: any;
    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    getIpAddress() {
        this.ip = this.http
            .get('https://api.ipify.org/')
            .pipe(
                catchError(this.handleError)
            );
    }

    getGEOLocation() {
        let url = "http://www.geoplugin.net/json.gp?ip=" + this.ip;
        return this.http
            .get(url)
            .pipe(
                catchError(this.handleError)
            );
    }

    saveCustumerData(custumer: any) {
        return this.http
            .post('/api/custumer', custumer, this.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }
    

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }
}