package com.example.comparateur.DTO.blog;

import lombok.Data;

@Data
public class CommentRequest {
    private String fullName;
    private String email;
    private String content;
}


