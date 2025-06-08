package com.ongi.backend.Repository;

import com.ongi.backend.Entity.OtherEmpathy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtherEmpathyRepository extends JpaRepository<OtherEmpathy, Long> {
}
