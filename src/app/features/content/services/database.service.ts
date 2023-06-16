import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { SeriesModel } from "../models/series.model";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "Accept": "application/json"
});


@Injectable()
export class DatabaseService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = "https://localhost:7280";
  }

  getAllSeries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllSeries`, { headers: headers, withCredentials: true });
  }

  getSingleSeries(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetSingleSeries?id=${id}`, { headers: headers, withCredentials: true });
  }

  postSingleSeries(series: SeriesModel): Observable<any> {
    const body = JSON.stringify(series);
    console.log(body);
    return this.http.post(`${this.baseUrl}/PostSingleSeries`,  body, { headers: headers, withCredentials: true });
  }

  getPageSeries(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetPageSeries?page=${page}`, { headers: headers, withCredentials: true });
  }

  deleteSeries(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteSingleSeries?id=${id}`, { headers: headers, withCredentials: true });
  }
}
