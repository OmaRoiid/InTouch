import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UserAuthService } from "./userAuth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserAuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.userService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set("authorization", "Bearer " + authToken),
    });
    return next.handle(authRequest);
  }
}
