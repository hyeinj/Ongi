package com.ongi.backend.Repository;

import com.ongi.backend.Entity.RealStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RealStoryRepository extends JpaRepository<RealStory, Long> {
}
