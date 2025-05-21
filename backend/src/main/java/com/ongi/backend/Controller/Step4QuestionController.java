package com.ongi.backend.Controller;

import com.ongi.backend.Service.Step4QuestionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/step4-question")
@CrossOrigin(origins = "http://localhost:3000")
public class Step4QuestionController {
    private final Step4QuestionService step4QuestionService;

    @Autowired
    public Step4QuestionController(Step4QuestionService step4QuestionService) {
        this.step4QuestionService = step4QuestionService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> generateStep4Question(@RequestBody Step4AnswerRequest request) {
        try {
            // 필수 데이터 검증
            if (request.getStep2Answer() == null || request.getStep2Answer().trim().isEmpty() ||
                request.getStep3Answer() == null || request.getStep3Answer().trim().isEmpty() ||
                request.getStep4Feelings() == null || request.getStep4Feelings().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "필수 데이터가 누락되었습니다.");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }

            String generatedQuestion = step4QuestionService.createQuestionFromAnswer(
                request.getStep4Answer(),
                request.getStep2Answer(),
                request.getStep3Answer(),
                request.getStep4Feelings()
            );
            
            Map<String, String> response = new HashMap<>();
            response.put("question", generatedQuestion);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "질문 생성 중 오류가 발생했습니다.");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

class Step4AnswerRequest {
    private String step4Answer;
    private String step2Answer;
    private String step3Answer;
    private String step4Feelings;
    
    public String getStep4Answer() { return step4Answer; }
    public void setStep4Answer(String step4Answer) { this.step4Answer = step4Answer; }
    
    public String getStep2Answer() { return step2Answer; }
    public void setStep2Answer(String step2Answer) { this.step2Answer = step2Answer; }
    
    public String getStep3Answer() { return step3Answer; }
    public void setStep3Answer(String step3Answer) { this.step3Answer = step3Answer; }
    
    public String getStep4Feelings() { return step4Feelings; }
    public void setStep4Feelings(String step4Feelings) { this.step4Feelings = step4Feelings; }
} 