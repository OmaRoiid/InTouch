import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularMateriaModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ProfileComponent } from "./profile/profile.component";

@NgModule({
  imports: [CommonModule, AngularMateriaModule, FormsModule, AuthRoutingModule],
  exports: [],
  declarations: [LoginComponent, SignupComponent, ProfileComponent],
  providers: [],
})
export class AuthModule {}
