import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(private userService:UserService) {}

  ngOnInit() {}

  onLogin(loginform:NgForm){
    this.userService.loginUser(loginform.value.email,loginform.value.password)

  }
}
