import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 10;
  NumOfpostsPerPage = 3;
  pageSizeOptions = [1, 2, 5, 8];
  private postsSub: Subscription;
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }
  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
  onChangePage(pageData :PageEvent){

  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
