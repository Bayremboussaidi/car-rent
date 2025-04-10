package com.example.comparateur.DTO.blog;

import lombok.Data;

@Data
public class BlogRequest {
    private String title;
    private String imgUrl;
    private String author;
    private String date;
    private String time;
    private String description;
    private String quote;
}


