package com.ongi.backend.Controller;

import com.ongi.backend.DTO.MockLetterDTO;
import com.ongi.backend.DTO.SelfEmpathyDTO;
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
}
