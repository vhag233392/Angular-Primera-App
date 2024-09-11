import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../modelo/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private localStorageKey: string = 'users_list';
  private apiUrl: string = 'https://jsonplaceholder.typicode.com/users'; // URL de la API

  constructor(private http: HttpClient) {}

  
  getApiUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }


  getLocalUsers(): IUser[] {
    const users = localStorage.getItem(this.localStorageKey);
    return users ? JSON.parse(users) : [];
  }


  getAllUsers(): Observable<IUser[]> {
    return this.getApiUsers().pipe(
      map(apiUsers => {
        const localUsers = this.getLocalUsers();
        return [...apiUsers, ...localUsers]; 
      })
    );
  }

  
  saveAll(users: IUser[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }


  addUser(user: IUser): void {

    this.getNextId().then(nextId => {
      user.id = nextId; 
      let users = this.getLocalUsers();
      users.push(user);
      this.saveAll(users);
    });
  }

  async getNextId(): Promise<number> {
    try {
      
      const apiUsers: IUser[] = (await this.getApiUsers().toPromise()) || [];  
      const apiMaxId = Math.max(...apiUsers.map(user => user.id), 0);
  
 
      const localUsers = this.getLocalUsers();
      const localMaxId = Math.max(...localUsers.map(user => user.id), 0);
  

      return Math.max(apiMaxId, localMaxId) + 1;
    } catch (error) {
      console.error('Error obteniendo los usuarios de la API:', error);
      return 1;
    }
  }
  
}
