package com.ongi.backend.Controller;

import com.ongi.backend.DTO.SelfEmpathyDTO;
import com.ongi.backend.Service.SelfSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/self-empathy-summary")
@CrossOrigin(origins = "http://localhost:3000")
public class SelfSummaryController {
    private final SelfSummaryService selfSummaryService;

    @Autowired
    public SelfSummaryController(SelfSummaryService selfSummaryService) {
        this.selfSummaryService = selfSummaryService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> generateSelfEmpathySummary(@RequestBody SelfEmpathyDTO.summaryRequestDTO summaryRequestDTO) {
        try {
            // 필수 데이터 검증
            if (summaryRequestDTO.getStep1_answer() == null || summaryRequestDTO.getStep1_answer().trim().isEmpty() ||
                    summaryRequestDTO.getStep2_answer() == null || summaryRequestDTO.getStep2_answer().trim().isEmpty() ||
                    summaryRequestDTO.getStep3Feelings() == null || summaryRequestDTO.getStep3Feelings().trim().isEmpty() ||
                    summaryRequestDTO.getStep4_answer() == null || summaryRequestDTO.getStep4_answer().trim().isEmpty() ||
                    summaryRequestDTO.getStep5_answer() == null || summaryRequestDTO.getStep5_answer().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "필수 데이터가 누락되었습니다.");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }

            String generatedQuestion = selfSummaryService.createQuestionFromAnswer(
                    summaryRequestDTO.getStep1_answer(), summaryRequestDTO.getStep2_answer(),
                    summaryRequestDTO.getStep3Feelings(), summaryRequestDTO.getStep4_answer(),
                    summaryRequestDTO.getStep5_answer()
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
