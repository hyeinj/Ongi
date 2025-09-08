package com.ongi.backend.DTO;

import com.ongi.backend.Entity.SelfEmpathy;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

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
        private List<String> highlights;
    }

}
