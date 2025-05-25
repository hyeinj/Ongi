package com.ongi.backend.Controller;

import com.ongi.backend.DTO.MockLetterDTO;
import com.ongi.backend.Service.MockLetterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mock-letter")
@CrossOrigin(origins = "http://localhost:3000")
public class MockLetterController {
    private MockLetterService mockLetterService;

    @Autowired
    public MockLetterController(MockLetterService mockLetterService) {
        this.mockLetterService = mockLetterService;
    }

    @PostMapping(value = "/generate-letter")
    public ResponseEntity<Map<String, String>> generateLetter(@RequestBody MockLetterDTO.generateLetterRequestDTO generateLetterRequestDTO) {
        try {
            String[] generatedLetter = mockLetterService.generateLetter(
                    generateLetterRequestDTO.getStep1_answer(), generateLetterRequestDTO.getStep2_answer(),
                    generateLetterRequestDTO.getStep3Feelings(), generateLetterRequestDTO.getStep4_answer(),
                    generateLetterRequestDTO.getStep5_answer()
            );

            Map<String, String> response = new HashMap<>();
            response.put("title", generatedLetter[0]);    // 제목
            response.put("content", generatedLetter[1]);  // 본문

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "질문 생성 중 오류가 발생했습니다.");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/feedback")
    public ResponseEntity<Map<String, String>> generateFeedback(@RequestBody MockLetterDTO.mockLetterFeedbackDTO mockLetterFeedbackDTO) {
        try {
            // 필수 데이터 검증
            if (mockLetterFeedbackDTO.getMock_letter() == null || mockLetterFeedbackDTO.getMock_letter().trim().isEmpty() ||
                mockLetterFeedbackDTO.getLetter_response()==null || mockLetterFeedbackDTO.getLetter_response().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "필수 데이터가 누락되었습니다.");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }

            // 첫 번째 feedback
            String generatedFeedback1 = mockLetterService.generateFeedback1(
                    mockLetterFeedbackDTO.getStep1_answer(), mockLetterFeedbackDTO.getStep2_answer(),
                    mockLetterFeedbackDTO.getStep3Feelings(), mockLetterFeedbackDTO.getStep4_answer(),
                    mockLetterFeedbackDTO.getStep5_answer(), mockLetterFeedbackDTO.getMock_letter(),
                    mockLetterFeedbackDTO.getLetter_response()
            );

            // 두 번째 feedback
            String[] generatedFeedback2 = mockLetterService.generateFeedback2(
                    mockLetterFeedbackDTO.getStep1_answer(), mockLetterFeedbackDTO.getStep2_answer(),
                    mockLetterFeedbackDTO.getStep3Feelings(), mockLetterFeedbackDTO.getStep4_answer(),
                    mockLetterFeedbackDTO.getStep5_answer(), mockLetterFeedbackDTO.getMock_letter(),
                    mockLetterFeedbackDTO.getLetter_response()
            );

            // 세 번째 feedback
            String[] generatedFeedback3 = mockLetterService.generateFeedback3(
                    mockLetterFeedbackDTO.getStep1_answer(), mockLetterFeedbackDTO.getStep2_answer(),
                    mockLetterFeedbackDTO.getStep3Feelings(), mockLetterFeedbackDTO.getStep4_answer(),
                    mockLetterFeedbackDTO.getStep5_answer(), mockLetterFeedbackDTO.getMock_letter(),
                    mockLetterFeedbackDTO.getLetter_response()
            );

            Map<String, String> response = new HashMap<>();
            response.put("generatedFeedback1", generatedFeedback1);
            response.put("generatedFeedback2-공감의 문구", generatedFeedback2[0]);
            response.put("generatedFeedback2-위로 문장", generatedFeedback2[1]);
            response.put("generatedFeedback3-피드백 요약 문장", generatedFeedback3[0]);
            response.put("generatedFeedback3-피드백 내용", generatedFeedback3[1]);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "질문 생성 중 오류가 발생했습니다.");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
