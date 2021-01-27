import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthModel } from "./auth.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class UserService {
  private isUserAuth = false;
  private token: string;
  private userTimer: any;
  private authStatusListenner = new Subject<boolean>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getUserAuth() {
    return this.isUserAuth;
  }
  getAuthStatusListenner() {
    return this.authStatusListenner.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthModel = { email: email, password: password };
    this.httpClient
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
  loginUser(email: string, password: string) {
    const authData: AuthModel = { email: email, password: password };
    this.httpClient
      .post<{ token: string; expiresIn: number }>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const userExpiresionTime = response.expiresIn;
          this.userTimer = setTimeout(() => {
            this.logout();
          }, userExpiresionTime * 1000);
          this.isUserAuth = true;
          this.authStatusListenner.next(true);
          this.router.navigate(["/"]);
        }
      });
  }
  logout() {
    this.token = null;
    this.isUserAuth = false;
    this.authStatusListenner.next(false);
    clearTimeout(this.userTimer)
    this.router.navigate(["/"]);
  }
}
