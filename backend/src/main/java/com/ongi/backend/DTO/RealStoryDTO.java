package com.ongi.backend.DTO;

import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
public class RealStoryDTO {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class realStoryRequestDTO{
        private String letter;
        private String response;
        private String category;
        private String emotion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class realStoryResponseDTO {
        private Long realStoryId;
        private String message;

        // 응답 시에는 전체 내용을 반환하지 않고 요약 정보만 포함
        @Size(max = 200, message = "편지 미리보기는 200자로 제한됩니다.")
        private String letterPreview;

        @Size(max = 200, message = "응답 미리보기는 200자로 제한됩니다.")
        private String responsePreview;
    }
}
