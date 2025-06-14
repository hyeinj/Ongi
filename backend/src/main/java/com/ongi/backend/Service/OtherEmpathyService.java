package com.ongi.backend.Service;

import com.ongi.backend.DTO.MockLetterDTO;
import com.ongi.backend.DTO.OtherEmpathyDTO;
import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.Entity.*;
import com.ongi.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OtherEmpathyService {
    private final OtherEmpathyRepository otherEmpathyRepository;
    private final ReportRepository reportRepository;
    private final HighlightsRepository highlightsRepository;
    private final SelfEmpathyRepository selfEmpathyRepository;

    // 타인공감 저장 및 Report 업데이트
    public ResponseDTO<OtherEmpathyDTO.otherEmpathyResponseDTO> saveOtherEmpathy(OtherEmpathyDTO.otherEmpathyRequestDTO request) {
        // 타인공감 저장
        OtherEmpathy otherEmpathy = new OtherEmpathy();

        Optional<SelfEmpathy> selfEmpathyOpt = selfEmpathyRepository.findById(request.getSelfempathyId());
        if (selfEmpathyOpt.isEmpty()) {
            throw new RuntimeException("해당 자기공감 기록을 찾을 수 없습니다.");
        }
        SelfEmpathy selfEmpathy = selfEmpathyOpt.get();
        // 기존 Report 찾아서 업데이트
        Report report = reportRepository.findBySelfEmpathy(selfEmpathy)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("해당 자기공감에 대한 리포트를 찾을 수 없습니다."));

        otherEmpathy.setRealStory(report.getMockLetter().getRealStory());
        otherEmpathy.setReview(request.getReview());

        OtherEmpathy savedOtherEmpathy = otherEmpathyRepository.save(otherEmpathy);

        // 하이라이트가 있는 경우에만 저장
        if (request.getHighlights() != null && !request.getHighlights().isEmpty()) {
            List<Highlights> highlightsList = new ArrayList<>();
            for (String content : request.getHighlights()) {
                if (content != null && !content.trim().isEmpty()) {
                    Highlights highlight = new Highlights();
                    highlight.setContent(content);
                    highlight.setOtherEmpathy(savedOtherEmpathy);
                    highlightsList.add(highlight);
                }
            }
            if (!highlightsList.isEmpty()) {
                highlightsRepository.saveAll(highlightsList);
            }
        }

        report.setOtherEmpathy(savedOtherEmpathy);
        reportRepository.save(report);


        OtherEmpathyDTO.otherEmpathyResponseDTO responseDTO =
                new OtherEmpathyDTO.otherEmpathyResponseDTO(
                        savedOtherEmpathy.getOtherempathyId(),
                        report.getReportId(),
                        "타인공감이 성공적으로 저장되었습니다.",
                        savedOtherEmpathy.getReview()
                );

        return ResponseDTO.success("타인공감 등록 완료", responseDTO);
    }

    public ResponseDTO<?> getResponseLetter(MockLetterDTO.getMockLetterDTO request) {
        Optional<SelfEmpathy> selfEmpathyOpt = selfEmpathyRepository.findById(request.getSelfempathyId());
        if (selfEmpathyOpt.isEmpty()) {
            throw new RuntimeException("해당 자기공감 기록을 찾을 수 없습니다.");
        }
        SelfEmpathy selfEmpathy = selfEmpathyOpt.get();
        // 기존 Report 찾아서 업데이트
        Report report = reportRepository.findBySelfEmpathy(selfEmpathy)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("해당 자기공감에 대한 리포트를 찾을 수 없습니다."));

        String responseTitle = report.getMockLetter().getRealStory().getResponseTitle();
        String responseContent = report.getMockLetter().getRealStory().getResponseContent();

        OtherEmpathyDTO.getResponseLetterResponseDTO responseDTO =
                new OtherEmpathyDTO.getResponseLetterResponseDTO(responseTitle, responseContent);


        return ResponseDTO.success("타인공감 답변 편지 조회 완료", responseDTO);
    }
}
