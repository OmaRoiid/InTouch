import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { UserAuthService } from "../auth/userAuth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  private AuthSup: Subscription;

  constructor(private userServices: UserAuthService) {}

  ngOnInit() {
    this.isAuth = this.userServices.getUserAuth();
    this.AuthSup = this.userServices
      .getAuthStatusListenner()
      .subscribe((authState) => {
        this.isAuth = authState;
      });
  }

  ngOnDestroy() {
    this.AuthSup.unsubscribe();
  }
  onUserLogout() {
    this.userServices.logout();
  }
}
