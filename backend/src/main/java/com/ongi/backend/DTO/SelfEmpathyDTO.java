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
}
