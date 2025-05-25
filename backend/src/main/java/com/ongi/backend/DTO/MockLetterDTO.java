package com.ongi.backend.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
}
