import { Component, OnInit, ViewChild } from "@angular/core";
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
  private userId: string;

  constructor(private userServices: UserAuthService) {}
  ngOnInit() {
    this.userId = this.userServices.getUserId();
    this.userServices.getUserInfoById(this.userId).subscribe((resutls) => {
      console.log(resutls);
      this.profileInfo = resutls.user;
    });
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
