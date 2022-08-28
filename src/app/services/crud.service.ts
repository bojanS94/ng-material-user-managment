import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../interfaces/users';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  serviceURL: string;

  constructor(private http: HttpClient) {
    this.serviceURL = "http://localhost:3000/users"
  }

  addUser(user: Users): Observable<Users> {
    return this.http.post<Users>(this.serviceURL, user);
  }

  getAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.serviceURL);
  }

  deleteUser(user: Users): Observable<Users> {
    return this.http.delete<Users>(this.serviceURL + '/' + user.id);
  }

  editUser(user: Users): Observable<Users> {
    return this.http.put<Users>(this.serviceURL + '/' + user.id, user);
  }
}
