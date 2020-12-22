import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  userPost=''
  newPost = '';
  constructor() {}

  ngOnInit(): void {}

  onAddPosts() {
    this.newPost = this.userPost;
  }
}
