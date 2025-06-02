package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "highlights")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Highlights {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "highlights_id")
    private Long highlightsId;

    @Column(name = "content")
    private String content;
}
