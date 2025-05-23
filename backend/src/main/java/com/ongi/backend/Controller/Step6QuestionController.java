package com.ongi.backend.Controller;

import com.ongi.backend.DTO.SelfEmpathyDTO;
import com.ongi.backend.Service.Step6QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/step6-question")
@CrossOrigin(origins = "http://localhost:3000")
public class Step6QuestionController {
    private final Step6QuestionService step6QuestionService;

    @Autowired
    public Step6QuestionController(Step6QuestionService step6QuestionService) {
        this.step6QuestionService = step6QuestionService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> generateStep5Question(@RequestBody SelfEmpathyDTO.step5RequestDTO step5RequestDTO) {
        try {
            // 필수 데이터 검증
            if (step5RequestDTO.getStep1_answer() == null || step5RequestDTO.getStep1_answer().trim().isEmpty() ||
                    step5RequestDTO.getStep2_answer() == null || step5RequestDTO.getStep2_answer().trim().isEmpty() ||
                    step5RequestDTO.getStep3Feelings() == null || step5RequestDTO.getStep3Feelings().trim().isEmpty() ||
                    step5RequestDTO.getStep4_answer() == null || step5RequestDTO.getStep4_answer().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "필수 데이터가 누락되었습니다.");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }

            String generatedQuestion = step6QuestionService.createQuestionFromAnswer(
                    step5RequestDTO.getStep1_answer(), step5RequestDTO.getStep2_answer(),
                    step5RequestDTO.getStep3Feelings(), step5RequestDTO.getStep4_answer()
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
