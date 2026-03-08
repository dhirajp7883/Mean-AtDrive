import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id?: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = "http://localhost:3024/api/auth";

  constructor(private http: HttpClient) { }

  register(payload: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, payload);
  }

  login(payload: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, payload);
  }


}
