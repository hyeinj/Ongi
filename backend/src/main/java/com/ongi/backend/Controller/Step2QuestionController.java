package com.ongi.backend.Controller;

import com.ongi.backend.Service.Step2QuestionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/step2-question")
@CrossOrigin(origins = "http://localhost:3000")
public class Step2QuestionController {
    private final Step2QuestionService step2QuestionService;

    @Autowired
    public Step2QuestionController(Step2QuestionService step2QuestionService) {
        this.step2QuestionService = step2QuestionService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> generateStep2Question(@RequestBody Step2AnswerRequest request) {
        String generatedQuestion = step2QuestionService.createQuestionFromAnswer(request.getAnswer());
        Map<String, String> response = new HashMap<>();
        response.put("question", generatedQuestion);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

class Step2AnswerRequest {
    private String answer;
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
} 