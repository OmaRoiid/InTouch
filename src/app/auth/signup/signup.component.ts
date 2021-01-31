import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { UserAuthService } from "../userAuth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(private userService: UserAuthService) {}

  ngOnInit() {
    this.authStatusSub = this.userService
      .getAuthStatusListenner()
      .subscribe((authState) => {
        this.isLoading = false;
      });
  }
  onSignUp(signupForm: NgForm) {
    if (signupForm.invalid) {
      return;
    }
    this.userService.createUser(
      signupForm.value.email,
      signupForm.value.password
    );
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
