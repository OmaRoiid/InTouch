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
              imagePath: post.imagePath,
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
    return this.mHttpClient.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.mHttpClient
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(
        (resData) => {
          const post: Post = {
            id: resData.post.id,
            title: resData.post.title,
            content: resData.post.content,
            imagePath: resData.post.imagePath,
          };
          this.posts.push(post);
          this.postsUpdatedObservable.next([...this.posts]);
          this.mRouter.navigate(["/"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.mHttpClient
      .put("http://localhost:3000/api/posts/edit/" + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: "",
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
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
