package com.ongi.backend.DTO;

import com.ongi.backend.Entity.MockLetter;
import com.ongi.backend.Entity.OtherEmpathy;
import com.ongi.backend.Entity.SelfEmpathy;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class ReportDTO {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GetReportResponseDTO{
        private Long reportId;
        private LocalDate reportDate;
        private String emotion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GetSingleReportResponseDTO {
        private Long reportId;
        private LocalDate reportDate;
        private Integer island;
        private String emotion;
        private String category;
        private SelfEmpathy selfEmpathy;
        private MockLetter mockLetter;
        private Long otherEmpathyId;
        private String otherEmpathyReview;
    }

}
