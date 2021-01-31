import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMateriaModule } from "../angular-material.module";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMateriaModule,
    RouterModule,
  ],
  exports: [],
  declarations: [PostCreateComponent, PostListComponent],
  providers: [],
})
export class PostModule {}
