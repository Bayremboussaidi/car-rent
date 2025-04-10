import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogData: any[] | undefined;

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    // Using the dynamic method to fetch blogs from the backend or fallback to static
    this.blogService.getAllBlogs().subscribe((data) => {
      this.blogData = data;
    });

    // If you want to use the static data (fallback or static version)
    // this.blogData = this.blogService.getStaticBlogs();
  }
}
