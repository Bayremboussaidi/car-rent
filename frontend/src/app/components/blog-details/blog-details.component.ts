import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  blogId: number | null = null;
  blog: any;
  otherBlogs: any[] = [];

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
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
}