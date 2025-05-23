package com.ongi.backend.Controller;

import com.ongi.backend.DTO.SelfEmpathyDTO;
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
    public ResponseEntity<Map<String, String>> generateStep4Question(@RequestBody SelfEmpathyDTO.step4RequestDTO step4RequestDTO) {
        try {
            // 필수 데이터 검증
            if (step4RequestDTO.getStep1_answer() == null || step4RequestDTO.getStep1_answer().trim().isEmpty() ||
                step4RequestDTO.getStep2_answer() == null || step4RequestDTO.getStep2_answer().trim().isEmpty() ||
                step4RequestDTO.getStep3Feelings() == null || step4RequestDTO.getStep3Feelings().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "필수 데이터가 누락되었습니다.");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }

            String generatedQuestion = step4QuestionService.createQuestionFromAnswer(
                step4RequestDTO.getStep1_answer(), step4RequestDTO.getStep2_answer(), step4RequestDTO.getStep3Feelings()
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