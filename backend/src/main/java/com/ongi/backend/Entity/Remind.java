package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "remind")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Remind {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "remind_id")
    private Long remindId;

    @Column(name = "text")
    private String text;

    @Column(name = "question")
    private String question;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();  // 저장 직전에 시간 설정
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
