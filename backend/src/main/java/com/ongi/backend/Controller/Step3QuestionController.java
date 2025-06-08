package com.ongi.backend.Controller;

import com.ongi.backend.DTO.SelfEmpathyDTO;
import com.ongi.backend.Service.Step3QuestionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/step3-question")
public class Step3QuestionController {
    private final Step3QuestionService step3QuestionService;

    @Autowired
    public Step3QuestionController(Step3QuestionService step3QuestionService) {
        this.step3QuestionService = step3QuestionService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> generateStep3Question(@RequestBody SelfEmpathyDTO.step3RequestDTO step3RequestDTO) {
        try {
            // 이전 질문인 1,2번 질문에 대한 답변이 존재하지 않는 경우 에러 처리
            if (step3RequestDTO.getStep2_answer() == null || step3RequestDTO.getStep2_answer().trim().isEmpty() ||
                    step3RequestDTO.getStep1_answer() == null || step3RequestDTO.getStep1_answer().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "답변이 비어있습니다.");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }

            // 1번과 2번 둘 다 답변이 존재한 상태에서만 GPT에 요청을 날릴거기 때문에 이렇게 바로 답변 전달해주기
            String generatedQuestion = step3QuestionService.createQuestionFromAnswer(
                step3RequestDTO.getStep1_answer(), step3RequestDTO.getStep2_answer()
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