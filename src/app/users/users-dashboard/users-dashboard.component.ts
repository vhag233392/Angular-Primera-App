import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { IUser } from '../modelo/iuser';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.css'
})
export class UsersDashboardComponent {

  users_list: IUser[] = []

  selected_user:IUser = {
    id: 1,
    name: "Usuario 1",
    username: "user_1",
    phone: "19997355272",
    website: "akjhbsasays"
  }

  message: string = "Hola Mundo"

  constructor(private _service: UserService){

    this._service.getAll().subscribe(
      response => this.users_list = response
    )

   }

   seleccionar_usuario(user: IUser): void{
    this.selected_user = user;
   }

   eventoRecibido(message: string){
    this.message = message
   }

}
