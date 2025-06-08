package com.ongi.backend.Repository;

import com.ongi.backend.Entity.RealStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RealStoryRepository extends JpaRepository<RealStory, Long> {
    @Query("SELECT r FROM RealStory r WHERE r.letter LIKE %:keyword%")
    List<RealStory> findByLetterContaining(@Param("keyword") String keyword);

    @Query("SELECT r FROM RealStory r WHERE r.response LIKE %:keyword%")
    List<RealStory> findByResponseContaining(@Param("keyword") String keyword);

    Optional<RealStory> findFirstByCategoryAndEmotion(String category, String emotion);
}
