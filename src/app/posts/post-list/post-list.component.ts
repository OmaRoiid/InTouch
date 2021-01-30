
import { Component, OnInit, OnDestroy, DoCheck } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { UserService } from "src/app/auth/user.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  isAuth = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  userId:string;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  private authSup: Subscription;

  constructor(
    public postsService: PostsService,
    private userServices: UserService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId=this.userServices.getUserId()
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
      this.isAuth=this.userServices.getUserAuth()
    this.authSup = this.userServices
      .getAuthStatusListenner()
      .subscribe((authState) => {
       
        this.isAuth = authState;
        this.userId = this.userServices.getUserId();
      });
  }
 

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
     console.log(this.isLoading);
    this.postsService.deletePost(postId).subscribe(() => {
      this.isLoading = false;
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
       this.isLoading = false;
       console.log(this.isLoading)
    },(err)=>{
      this.isLoading=false;
      console.log(err);

    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSup.unsubscribe();
  }
}
