package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "report")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "selfempathy_id")
    private SelfEmpathy selfEmpathy;

    @ManyToOne
    @JoinColumn(name = "mockletter_id")
    private MockLetter mockLetter;

    @ManyToOne
    @JoinColumn(name = "otherempathy_id")
    private OtherEmpathy otherEmpathy;

    @Column(name = "island")
    private Integer island;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();  // 저장 직전에 시간 설정
    }
}
