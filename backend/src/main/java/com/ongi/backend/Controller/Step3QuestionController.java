package com.ongi.backend.Controller;

import com.ongi.backend.Service.Step3QuestionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/step3-question")
@CrossOrigin(origins = "http://localhost:3000")
public class Step3QuestionController {
    private final Step3QuestionService step3QuestionService;

    @Autowired
    public Step3QuestionController(Step3QuestionService step3QuestionService) {
        this.step3QuestionService = step3QuestionService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> generateStep3Question(@RequestBody Step3AnswerRequest request) {
        try {
            if (request.getStep3Answer() == null || request.getStep3Answer().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "답변이 비어있습니다.");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }

            String generatedQuestion = step3QuestionService.createQuestionFromAnswer(
                request.getStep3Answer(), 
                request.getStep2Answer() != null ? request.getStep2Answer() : ""
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

class Step3AnswerRequest {
    private String step3Answer;
    private String step2Answer;
    
    public String getStep3Answer() { return step3Answer; }
    public void setStep3Answer(String step3Answer) { this.step3Answer = step3Answer; }
    
    public String getStep2Answer() { return step2Answer; }
    public void setStep2Answer(String step2Answer) { this.step2Answer = step2Answer; }
} 