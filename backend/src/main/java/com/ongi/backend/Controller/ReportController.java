package com.ongi.backend.Controller;

import com.ongi.backend.DTO.ReportDTO;
import com.ongi.backend.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/island")
public class ReportController {
    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // 아카이빙 섬 report 전부 조회 api
    @GetMapping
    public List<ReportDTO.GetReportResponseDTO> getAllReports(@RequestParam Long island) {
        return reportService.getReports(island);
    }

    // 아카이빙 섬 개별 report 조회 api
    @GetMapping("/report")
    public ReportDTO.GetSingleReportResponseDTO getReport(@RequestParam Long reportId) {
        return reportService.getReport(reportId);
    }
}
