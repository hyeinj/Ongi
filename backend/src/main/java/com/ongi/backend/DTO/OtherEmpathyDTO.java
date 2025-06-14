package com.ongi.backend.DTO;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class OtherEmpathyDTO {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class otherEmpathyRequestDTO {
        private String review;
        private List<String> highlights;
        private Long selfempathyId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class otherEmpathyResponseDTO {
        private Long otherEmpathyId;
        private Long reportId;
        private String message;
        private String review;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class getResponseLetterResponseDTO {
        private String responseTitle;
        private String responseContent;
    }
}
