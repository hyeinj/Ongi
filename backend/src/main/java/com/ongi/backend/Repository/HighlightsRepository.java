package com.ongi.backend.Repository;

import com.ongi.backend.Entity.Highlights;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HighlightsRepository extends JpaRepository<Highlights, Long> {
}
