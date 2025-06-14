package com.ongi.backend.Service;

import com.ongi.backend.DTO.OtherEmpathyDTO;
import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.Entity.RealStory;
import com.ongi.backend.Repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {
    private final ReportRepository reportRepository;

    // 아카이빙 섬 별로 report 조회 - 오늘 날짜 전 날까지의 report만 조회되도록(오늘거는 localStorage에서)
//    public ResponseDTO<RealStoryDTO.realStoryResponseDTO> getReports(Long island) {
//        String responseTitle = "임시";
//        String responseContent = "임시";
//
//        OtherEmpathyDTO.getResponseLetterResponseDTO responseDTO =
//                new OtherEmpathyDTO.getResponseLetterResponseDTO(responseTitle, responseContent);
//
//
//        return ResponseDTO.success("아카이빙 섬 report 조회 완료", responseDTO);
//    }

}
