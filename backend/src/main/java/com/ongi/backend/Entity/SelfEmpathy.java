package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "self_empathy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelfEmpathy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "selfempathy_id")
    private Long selfempathyId;

    @Column(name = "one_question", columnDefinition = "TEXT")
    private String oneQuestion;

    @Column(name = "one_answer", columnDefinition = "TEXT")
    private String oneAnswer;

    @Column(name = "two_question", columnDefinition = "TEXT")
    private String twoQuestion;

    @Column(name = "two_answer", columnDefinition = "TEXT")
    private String twoAnswer;

    @Column(name = "three_question", columnDefinition = "TEXT")
    private String threeQuestion;

    @Column(name = "three_answer", columnDefinition = "TEXT")
    private String threeAnswer;

    @Column(name = "four_question", columnDefinition = "TEXT")
    private String fourQuestion;

    @Column(name = "four_answer", columnDefinition = "TEXT")
    private String fourAnswer;

    @Column(name = "five_question", columnDefinition = "TEXT")
    private String fiveQuestion;

    @Column(name = "five_answer", columnDefinition = "TEXT")
    private String fiveAnswer;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "category")
    private String category;

    @Column(name = "emotion")
    private String emotion;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();  // 저장 직전에 시간 설정
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
