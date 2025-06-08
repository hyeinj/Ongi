package com.ongi.backend.DTO;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
public class MockLetterDTO {

    @NoArgsConstructor
    @Getter
    @Setter
    public static class generateLetterRequestDTO{
        private String step1_answer;
        private String step2_answer;
        private String step3Feelings;
        private String step4_answer;
        private String step5_answer;
    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class mockLetterFeedbackDTO{
        private String step1_answer;
        private String step2_answer;
        private String step3Feelings;
        private String step4_answer;
        private String step5_answer;
        private String mock_letter;
        private String letter_response;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class mockLetterRequestDTO {
        private String userResponse;
        private String feedback1;
        private String feedback2Title;
        private String feedback2Content;
        private String feedback3Title;
        private String feedback3Content;
        private Long realstoryId;
        // review는 선택사항
        private String review;
        private Long selfempathyId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class mockLetterResponseDTO {
        private Long mockLetterId;
        private Long reportId;
        private String message;
        private String review;
    }
}
