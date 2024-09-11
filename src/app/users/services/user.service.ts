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

  // Obtener usuarios desde la API
  getApiUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  // Obtener usuarios desde el localStorage
  getLocalUsers(): IUser[] {
    const users = localStorage.getItem(this.localStorageKey);
    return users ? JSON.parse(users) : [];
  }

  // Obtener usuarios combinados (API + localStorage)
  getAllUsers(): Observable<IUser[]> {
    return this.getApiUsers().pipe(
      map(apiUsers => {
        const localUsers = this.getLocalUsers();
        return [...apiUsers, ...localUsers]; // Combina los usuarios de la API con los locales
      })
    );
  }

  // Guardar lista de usuarios en localStorage
  saveAll(users: IUser[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }

  // Añadir un nuevo usuario con ID incremental
  addUser(user: IUser): void {
    // Obtener el siguiente ID disponible
    this.getNextId().then(nextId => {
      user.id = nextId; // Asignar el ID incrementado
      let users = this.getLocalUsers();
      users.push(user);
      this.saveAll(users);
    });
  }

  // Obtener el siguiente ID disponible tomando en cuenta usuarios de la API y LocalStorage
  async getNextId(): Promise<number> {
    try {
      // Obtener los usuarios desde la API, asegurando que no sea undefined
      const apiUsers: IUser[] = (await this.getApiUsers().toPromise()) || [];  // Si es undefined, asigna un array vacío
      const apiMaxId = Math.max(...apiUsers.map(user => user.id), 0);
  
      // Obtener los usuarios locales
      const localUsers = this.getLocalUsers();
      const localMaxId = Math.max(...localUsers.map(user => user.id), 0);
  
      // Devuelve el ID más alto más 1
      return Math.max(apiMaxId, localMaxId) + 1;
    } catch (error) {
      console.error('Error obteniendo los usuarios de la API:', error);
      return 1;  // Si algo falla, devolver el ID 1 como fallback
    }
  }
  
}
