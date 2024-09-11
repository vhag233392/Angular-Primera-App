import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '../modelo/iuser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {

  @Input() user: IUser = {
    id: 0,
    name: "",
    username: "",
    phone: "",
    website: ""
  }

  @Output() event = new EventEmitter<string>();

  constructor(private userService: UserService) {}

  mostrar(): void{
    console.log(this.user);
  }

  enviar(){
    this.userService.addUser(this.user);
    this.event.emit('Usuario añadido');
  }
}
