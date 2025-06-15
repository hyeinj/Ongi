package com.ongi.backend.Repository;

import com.ongi.backend.Entity.Report;
import com.ongi.backend.Entity.SelfEmpathy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findBySelfEmpathy(SelfEmpathy selfEmpathy);
    List<Report> findByIslandAndCreatedAtBefore(Integer island, LocalDateTime beforeDate);
}
