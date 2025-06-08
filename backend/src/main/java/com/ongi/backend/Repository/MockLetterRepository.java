package com.ongi.backend.Repository;

import com.ongi.backend.Entity.MockLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MockLetterRepository extends JpaRepository<MockLetter, Long> {
}
