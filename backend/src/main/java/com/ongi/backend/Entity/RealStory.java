package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "real_story")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RealStory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "realstory_id")
    private Long realstoryId;

    @Column(name = "letter_title", columnDefinition = "TEXT")
    private String letterTitle;

    @Column(name = "letter_content", columnDefinition = "TEXT")
    private String letterContent;

    @Column(name = "response_title", columnDefinition = "TEXT")
    private String responseTitle;

    @Column(name = "response_content", columnDefinition = "TEXT")
    private String responseContent;

    @Column(name = "category")
    private String category;

    @Column(name = "emotion")
    private String emotion;
}
