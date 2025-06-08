package com.ongi.backend.Repository;

import com.ongi.backend.Entity.Report;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findBySelfempathyId(Long selfempathyId);
    List<Report> findByOtherempathyId(Long otherempathyId);
}
