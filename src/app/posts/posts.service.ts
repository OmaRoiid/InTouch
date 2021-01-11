import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { from, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdatedObservable = new Subject<Post[]>();

  constructor(private mHttpClient: HttpClient, private mRouter: Router) {}
  getPosts() {
    this.mHttpClient
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map((resutls) => {
          return resutls.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData;
        this.postsUpdatedObservable.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdatedObservable.asObservable();
  }
  getPostById(id: string) {
   return this.mHttpClient.get<{ _id: string; title: string; content: string }>(
     "http://localhost:3000/api/posts/" + id
   );
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.mHttpClient
      .post<{ message: string; postId: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe(
        (resData) => {
          const postId = resData.postId;
          post.id = postId;
          this.posts.push(post);
          this.postsUpdatedObservable.next([...this.posts]);
          this.mRouter.navigate(["/"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  updatePost(id: string, title: string, content: string) {
    const postToUpdate: Post = { id: id, title: title, content: content };
    this.mHttpClient
      .put("http://localhost:3000/api/posts/edit/" + id, postToUpdate)
      .subscribe((response) => {
        const updatePosts = [...this.posts];
        const oldPostsIndex = updatePosts.findIndex(
          (p) => p.id === postToUpdate.id
        );
        updatePosts[oldPostsIndex] = postToUpdate;
        this.posts = updatePosts;
        this.postsUpdatedObservable.next([...this.posts]);
        this.mRouter.navigate(["/"]);
      });
  }
  deletePost(id: string) {
    this.mHttpClient
      .delete("http://localhost:3000/api/posts/" + id)
      .subscribe(() => {
        console.log("Deleted");
        const updatedPostsAfterDeleteing = this.posts.filter(
          (post) => post.id !== id
        );
        this.posts = updatedPostsAfterDeleteing;
        this.postsUpdatedObservable.next([...this.posts]);
      });
  }
}
