import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.authStatusSub = this.userService
      .getAuthStatusListenner()
      .subscribe((authState) => {
        this.isLoading = false;
      });
  }

  onLogin(loginform: NgForm) {
    this.userService.loginUser(loginform.value.email, loginform.value.password);
  }
  ngOnDestroy() {
   this.authStatusSub.unsubscribe();
  }
}
