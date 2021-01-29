import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import {Costume} from "./costume-type.validator"

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  mPost: Post;
  isLoading = false;
  postForm: FormGroup;
  imagePreview:string
  private mode = "create";
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.postForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [Costume],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPostById(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.mPost = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
          };
          this.postForm.setValue({
            title: this.mPost.title,
            content: this.mPost.content,
            image:this.mPost.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.postForm.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postsService.addPost(
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    }
    this.postForm.reset();
  }
  onImageSelected(event: Event) {
    const selectedImage = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ image: selectedImage });
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload=()=>{
      this.imagePreview=reader.result as string
    }
    reader.readAsDataURL(selectedImage)
  }
}
