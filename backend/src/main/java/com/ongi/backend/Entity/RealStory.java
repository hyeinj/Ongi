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

    @Column(name = "letter", columnDefinition = "TEXT")
    private String letter;

    @Column(name = "response", columnDefinition = "TEXT")
    private String response;

    @Column(name = "category")
    private String category;

    @Column(name = "emotion")
    private String emotion;
}
