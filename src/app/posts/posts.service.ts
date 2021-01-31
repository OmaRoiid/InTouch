import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { environment } from "src/environments/environment";

const BASE_URL = environment.apiUrl + "/posts";
@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdatedObservable = new Subject<{
    posts: Post[];
    postCount: number;
  }>();

  constructor(private mHttpClient: HttpClient, private mRouter: Router) {}
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.mHttpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        BASE_URL + queryParams
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
                creator: post.creator,
              };
            }),
            maxPosts: resutls.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        console.log(transformedPostsData);
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
      creator: string;
    }>(BASE_URL + `/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.mHttpClient
      .post<{ message: string; post: Post }>(BASE_URL, postData)
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
        creator: null,
      };
    }
    this.mHttpClient
      .put(BASE_URL + `/edit/${id}`, postData)
      .subscribe((response) => {
        this.mRouter.navigate(["/"]);
      });
  }
  deletePost(id: string) {
    return this.mHttpClient.delete(BASE_URL + `/${id}`);
  }
}
