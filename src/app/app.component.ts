import { Component, OnInit } from '@angular/core';
import { UserAuthService } from "./auth/userAuth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(private userServices: UserAuthService) {}
  ngOnInit() {
    this.userServices.autoAuthUser();
  }
}
