package com.ongi.backend.Repository;

import com.ongi.backend.Entity.SelfEmpathy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelfEmpathyRepository extends JpaRepository<SelfEmpathy, Long> {
}
