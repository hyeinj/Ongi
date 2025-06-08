package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mock_letter")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MockLetter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mockletter_id")
    private Long mockletterId;

    @Column(name = "user_response", columnDefinition = "TEXT")
    private String userResponse;

    @Column(name = "feedback1")
    private String feedback1;

    @Column(name = "feedback2_title")
    private String feedback2Title;

    @Column(name = "feedback2_content")
    private String feedback2Content;

    @Column(name = "feedback3_title")
    private String feedback3Title;

    @Column(name = "feedback3_content")
    private String feedback3Content;

    @Column(name = "review")
    private String review;

    @ManyToOne
    @JoinColumn(name = "realstory_id")
    private RealStory realStory;
}
