package com.ongi.backend.Service;

import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ReportDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.Entity.*;
import com.ongi.backend.Repository.HighlightsRepository;
import com.ongi.backend.Repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {
    private final ReportRepository reportRepository;
    private final HighlightsRepository highlightsRepository;

    // 아카이빙 섬 별로 report 조회 - 오늘 날짜 전 날까지의 report만 조회되도록(오늘거는 localStorage에서)
    public List<ReportDTO.GetReportResponseDTO> getReports(Long island) {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay(); // 오늘 00:00

        // 오늘 이전의 report 조회
        List<Report> reports = reportRepository.findByIslandAndCreatedAtBefore(island.intValue(), todayStart);

        // Report → DTO 변환
        return reports.stream()
                .map(report -> new ReportDTO.GetReportResponseDTO(
                        report.getReportId(),
                        report.getCreatedAt().toLocalDate(),
                        report.getSelfEmpathy().getEmotion()  // SelfEmpathy에서 emotion 추출
                ))
                .toList();
    }

    // 아카이빙 섬 - report 조회
    public ReportDTO.GetSingleReportResponseDTO getReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("해당 리포트를 찾을 수 없습니다."));

        SelfEmpathy selfEmpathy = report.getSelfEmpathy();
        MockLetter mockLetter = report.getMockLetter();
        OtherEmpathy otherEmpathy = report.getOtherEmpathy();

        List<String> highlightContents = new ArrayList<>();
        if (otherEmpathy != null) {
            highlightContents = highlightsRepository.findByOtherEmpathy(otherEmpathy).stream()
                    .map(Highlights::getContent)
                    .toList();
        }

        return new ReportDTO.GetSingleReportResponseDTO(
                report.getReportId(),
                report.getCreatedAt().toLocalDate(),
                report.getIsland(),
                selfEmpathy != null ? selfEmpathy.getEmotion() : null,
                selfEmpathy != null ? selfEmpathy.getCategory() : null,
                selfEmpathy,
                mockLetter,
                otherEmpathy != null ? otherEmpathy.getOtherempathyId() : null,
                otherEmpathy != null ? otherEmpathy.getReview() : null,
                highlightContents
        );
    }


}
