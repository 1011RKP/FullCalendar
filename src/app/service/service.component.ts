import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http'
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';



const httHeaders = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json;odata=verbose'
  })
}

@Injectable()
export class ServiceComponent implements OnInit {
 private siteURL = 'https://incyte.sharepoint.com/sites/it';
 constructor(
    private _http: HttpClient
  ) { }
  ngOnInit() {
  }

  getlistItems(url: string): Observable<any> {
    const httpURL = this.siteURL + url;
    return this._http.get(httpURL, httHeaders).pipe(
      tap(data => 
        this.log('fetch Data')
      ),
      catchError(this.handleError('getListItem', []))
    );
  }

  getCurrentItem(url: string): Observable<any> {
    const httpURL = this.siteURL + url;
    return this._http.get(httpURL, httHeaders).pipe(
      tap(data => 
        this.log('fetch Data')
      ),
      catchError(this.handleError('getListItem', []))
    );
  }

  private log(message: string) {
    console.log('AppService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error('Verbose Logging'); 
      console.error(error); 
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}