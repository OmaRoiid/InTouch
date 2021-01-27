import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private userServices: UserService,private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isUserAuth = this.userServices.getUserAuth();
    if (!isUserAuth) {
        this.router.navigate(['/login']);
    }
    return isUserAuth;
  }
}
