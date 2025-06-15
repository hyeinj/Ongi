package com.ongi.backend.Repository;

import com.ongi.backend.Entity.Highlights;
import com.ongi.backend.Entity.OtherEmpathy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HighlightsRepository extends JpaRepository<Highlights, Long> {
    List<Highlights> findByOtherEmpathy(OtherEmpathy otherEmpathy);
}
