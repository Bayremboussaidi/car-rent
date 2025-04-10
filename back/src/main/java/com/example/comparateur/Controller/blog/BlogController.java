package com.example.comparateur.Controller.blog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.comparateur.DTO.blog.BlogRequest;
import com.example.comparateur.DTO.blog.CommentRequest;
import com.example.comparateur.Entity.blog.Blog;
import com.example.comparateur.Entity.blog.Comment;
import com.example.comparateur.Repository.blog.BlogRepository;
import com.example.comparateur.Repository.blog.CommentRepository;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*") // Adjust for security
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private CommentRepository commentRepository;

    // Add Blog
    @PostMapping
    public Blog addBlog(@RequestBody BlogRequest blogRequest) {
        Blog blog = new Blog();
        blog.setTitle(blogRequest.getTitle());
        blog.setImgUrl(blogRequest.getImgUrl());
        blog.setAuthor(blogRequest.getAuthor());
        blog.setDate(blogRequest.getDate());
        blog.setTime(blogRequest.getTime());
        blog.setDescription(blogRequest.getDescription());
        blog.setQuote(blogRequest.getQuote());
        return blogRepository.save(blog);
    }

    // Get All Blogs
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // Get Blog by ID
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete Blog
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        return blogRepository.findById(id).map(blog -> {
            blogRepository.delete(blog);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Add Comment to Blog
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addCommentToBlog(@PathVariable Long id, @RequestBody CommentRequest request) {
        return blogRepository.findById(id).map(blog -> {
            Comment comment = new Comment();
            comment.setFullName(request.getFullName());
            comment.setEmail(request.getEmail());
            comment.setContent(request.getContent());
            comment.setBlog(blog);
            commentRepository.save(comment);
            return ResponseEntity.ok(comment);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Get Blog with Comments
    @GetMapping("/{id}/with-comments")
    public ResponseEntity<Blog> getBlogWithComments(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
