package com.ongi.backend.Controller;

import com.ongi.backend.DTO.MockLetterDTO;
import com.ongi.backend.DTO.OtherEmpathyDTO;
import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.Repository.OtherEmpathyRepository;
import com.ongi.backend.Service.OtherEmpathyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/other-empathy")
public class OtherEmpathyController {
    private final OtherEmpathyService otherEmpathyService;

    @Autowired
    public OtherEmpathyController(OtherEmpathyService otherEmpathyService) {
        this.otherEmpathyService = otherEmpathyService;
    }

    // 타인공감 저장 API
    @PostMapping("/save")
    public ResponseDTO<?> saveOtherEmpathy(@RequestBody OtherEmpathyDTO.otherEmpathyRequestDTO requestDTO) {
        return otherEmpathyService.saveOtherEmpathy(requestDTO);
    }

    // 타인공감 - 실제 답변 편지 조회 API
    @GetMapping
    public ResponseDTO<?> getResponseLetter(@RequestBody MockLetterDTO.getMockLetterDTO request) {
        return otherEmpathyService.getResponseLetter(request);
    }
}
