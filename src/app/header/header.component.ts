import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { UserAuthService } from "../auth/userAuth.service";
import { HeaderTitelService } from "../header-titel.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  private AuthSup: Subscription;
  headerTitel = "";

  constructor(private userServices: UserAuthService,private mHeaderTitel: HeaderTitelService) {}

  ngOnInit() {
    this.isAuth = this.userServices.getUserAuth();
    this.AuthSup = this.userServices
      .getAuthStatusListenner()
      .subscribe((authState) => {
        this.isAuth = authState;
      });
       this.mHeaderTitel.title.subscribe((updatedTitle) => {
         this.headerTitel = updatedTitle;
       });
  }

  ngOnDestroy() {
    this.AuthSup.unsubscribe();
  }
  onUserLogout() {
    this.userServices.logout();
  }
}
