package com.ongi.backend.Controller;

import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.DTO.SelfEmpathyDTO;
import com.ongi.backend.Service.RealStoryService;
import com.ongi.backend.Service.SelfSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/real-story")
public class RealStoryController {
    private final RealStoryService realStoryService;

    @Autowired
    public RealStoryController(RealStoryService realStoryService) {
        this.realStoryService = realStoryService;
    }

    // 실제사연 저장 API
    @PostMapping("/save")
    public ResponseDTO<?> saveRealStory(@RequestBody RealStoryDTO.realStoryRequestDTO realStoryDTO) {
        return realStoryService.saveRealStory(realStoryDTO);
    }
}
