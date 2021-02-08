import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatAccordion } from "@angular/material/expansion";
import { UserModel } from "../user.model";
import { UserAuthService } from "../userAuth.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  profileInfo: UserModel;
  updatedProfileInfo:UserModel;
  private userId: string;
  step = 0;

  constructor(private userServices: UserAuthService) {}
  ngOnInit() {
    this.userId = this.userServices.getUserId();
    this.userServices.getUserInfoById(this.userId).subscribe((resutls) => {
      console.log(resutls);
        console.log(resutls.user);
      this.profileInfo = resutls.user;
    });
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
  UpdateUserInfo(userInfoForm:NgForm){
  const updatedUser:UserModel={
     email: this.profileInfo.email,
  password: this.profileInfo.password,
  name:userInfoForm.value.name ,
  age: userInfoForm.value.age,
  country: userInfoForm.value.country,
  birthday: userInfoForm.value.birthday,
  }
    console.log(updatedUser);
    console.log(this.userId)
    this.userServices.updateUserInfo(this.userId,updatedUser)
  }
}
