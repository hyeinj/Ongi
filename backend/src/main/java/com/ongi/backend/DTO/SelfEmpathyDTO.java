package com.ongi.backend.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class SelfEmpathyDTO {

    @NoArgsConstructor
    @Getter
    @Setter
    public static class step2RequestDTO{
        private String step1_answer;
    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class step3RequestDTO{
        private String step1_answer;
        private String step2_answer;
    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class step4RequestDTO{
        private String step1_answer;
        private String step2_answer;
        private String step3Feelings;
    }

    // step 5,6 둘 다 이 DTO 사용
    @NoArgsConstructor
    @Getter
    @Setter
    public static class step5RequestDTO{
        private String step1_answer;
        private String step2_answer;
        private String step3Feelings;
        private String step4_answer;
    }

    // summary에서 사용하는 DTO
    @NoArgsConstructor
    @Getter
    @Setter
    public static class summaryRequestDTO{
        private String step1_answer;
        private String step2_answer;
        private String step3Feelings;
        private String step4_answer;
        private String step5_answer;
    }
}
