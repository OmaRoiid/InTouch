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
  autoAuthUser() {
    const authUserInfo = this.getAuthData();
    if(!authUserInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authUserInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      //check if the time that app running  is in the reange of is expirationDate
      this.token = authUserInfo.token;
      this.isUserAuth = true;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListenner.next(true);
    }
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
          this.setAuthTimer(userExpiresionTime);
          this.isUserAuth = true;
          this.authStatusListenner.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + userExpiresionTime * 1000
          );
          this.saveAuthData(token, expirationDate);
          this.router.navigate(["/"]);
        }
      });
  }
  logout() {
    this.token = null;
    this.isUserAuth = false;
    this.authStatusListenner.next(false);
    clearTimeout(this.userTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }
  private setAuthTimer(duration: number) {
    this.userTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationTime: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationTime.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
