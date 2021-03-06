//this file will mange all app routing
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
const routes: Routes = [
  { path: "", component: PostListComponent, data: { title: "Posts" } },
  {
    path: "create",
    component: PostCreateComponent,
    canActivate: [AuthGuard],
    data: { title: "Create" },
  },
  {
    path: "edit/:postId",
    component: PostCreateComponent,
    canActivate: [AuthGuard],
    data: { title: "Edit" },
  },
  {
    path: "user",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule {}
