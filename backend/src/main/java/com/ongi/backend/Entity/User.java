package com.ongi.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "id")
    private Long id;

    @Column(name = "user_name")
    private String user_name;

    @Column(name = "password")
    private String password;

    @Column(name = "level")
    private Integer level;

    @Column(name = "exp")
    private Integer exp;

}
