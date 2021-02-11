import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class HeaderTitelService  {
  title = new BehaviorSubject("Initial Title");

  setTitle(title: string) {
    this.title.next(title);
  }
}
