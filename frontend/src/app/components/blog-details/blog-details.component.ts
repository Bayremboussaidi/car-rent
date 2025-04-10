import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { UserloginService } from '../../services/user_login/userlogin.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  blogId: number | null = null;
  blog: any;
  otherBlogs: any[] = [];

  review: {
    username: string;
    email: string;
    commentText: string;
  } = {
    username: '',
    email: '',
    commentText: ''
  };

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private userLoginService: UserloginService
  ) {}

  ngOnInit(): void {
    this.loadUserData();

    this.route.paramMap.subscribe(params => {
      console.log("cv1");
      const id = params.get('id');
      if (id) {
        console.log("cv");
        this.blogId = +id; // Convert the id to a number
        this.blog = this.blogService.getBlogById(this.blogId);
        this.otherBlogs = this.blogService.getOtherBlogs(this.blogId);
      }
    });
  }

  private loadUserData(): void {
    const currentUser = this.userLoginService.getCurrentUser();
    if (currentUser) {
      this.review.username = [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ');
      this.review.email = currentUser.email || '';
    }
  }

  submitComment(): void {
    if (!this.review.commentText) return;

    const commentPayload = {
      username: this.review.username,
      email: this.review.email,
      commentText: this.review.commentText
    };

    console.log('Comment submitted:', commentPayload);

    // Optionally: send this to your backend here
    this.review.commentText = '';
  }
}
