package com.ongi.backend.Controller;

import com.ongi.backend.DTO.SelfEmpathyDTO;
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
    public ResponseEntity<Map<String, String>> generateStep2Question(@RequestBody SelfEmpathyDTO.step2RequestDTO step2RequestDTO) {
        // 이전 질문인 1번 질문에 대한 답변이 존재하지 않음
        if (step2RequestDTO.getStep1_answer() == null || step2RequestDTO.getStep1_answer().trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "답변이 비어있습니다.");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        String answer = step2RequestDTO.getStep1_answer();
        String generatedQuestion = step2QuestionService.createQuestionFromAnswer(answer);
        Map<String, String> response = new HashMap<>();
        response.put("question", generatedQuestion);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}