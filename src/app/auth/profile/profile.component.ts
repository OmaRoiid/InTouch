import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatAccordion } from "@angular/material/expansion";
import { HeaderTitelService } from "src/app/header-titel.service";
import { UserModel } from "../user.model";
import { UserAuthService } from "../userAuth.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  isLoading = false;
  profileInfo: UserModel;
  updatedProfileInfo: UserModel;
  private userId: string;
  step = 0;

  constructor(
    private userServices: UserAuthService,
    private mHeaderTitel: HeaderTitelService
  ) {}
  ngOnInit() {
     this.isLoading = true;
    this.userId = this.userServices.getUserId();
    this.userServices.getUserInfoById(this.userId).subscribe((resutls) => {
      console.log(resutls);
      console.log(resutls.user);
      this.profileInfo = resutls.user;
       this.isLoading = false;
    });
    this.mHeaderTitel.setTitle("Profile");
   

  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  UpdateUserInfo(userInfoForm: NgForm) {
    this.isLoading=true
    const updatedUser: UserModel = {
      email: this.profileInfo.email,
      password: this.profileInfo.password,
      name: userInfoForm.value.name,
      age: userInfoForm.value.age,
      country: userInfoForm.value.country,
      birthday: userInfoForm.value.birthday,
    };
    this.userServices.updateUserInfo(this.userId, updatedUser);
    this.isLoading=false
  }
}
