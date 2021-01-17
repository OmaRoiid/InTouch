import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { from, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdatedObservable = new Subject<{posts:Post[],postCount:number}>();

  constructor(private mHttpClient: HttpClient, private mRouter: Router) {}
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.mHttpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map((resutls) => {
          return {
            posts: resutls.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: resutls.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdatedObservable.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
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
        this.mRouter.navigate(["/"]);
      });
  }
  deletePost(id: string) {
   return this.mHttpClient.delete("http://localhost:3000/api/posts/" + id)
     
  }
}
