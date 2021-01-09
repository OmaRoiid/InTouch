import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private mHttpClient: HttpClient) {}
  getPosts() {
    this.mHttpClient
      .get<{ message: string; posts: Post[] }>(
        "http://localhost:3000/api/posts"
      )
      .subscribe((postsData) => {
        this.posts = postsData.posts;
        this.postsUpdated.next([...this.posts]);
      });
    //return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.mHttpClient
      .post<{ message: string }>("http://localhost:3000/api/posts", post)
      .subscribe((resData) => {
        console.log(resData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      },(error)=>{
        console.log(error)
      }

      );
  }
}
