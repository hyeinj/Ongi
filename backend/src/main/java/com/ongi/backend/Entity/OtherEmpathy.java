package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "other_empathy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtherEmpathy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otherempathy_id")
    private Long otherempathyId;

    @ManyToOne
    @JoinColumn(name = "realstory_id")
    private RealStory realStory;

    @ManyToOne
    @JoinColumn(name = "highlights_id")
    private Highlights highlights;

    @Column(name = "review")
    private String review;
}
