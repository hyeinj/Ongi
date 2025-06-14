package com.ongi.backend.Controller;

import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.Entity.Report;
import com.ongi.backend.Repository.ReportRepository;
import com.ongi.backend.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // 아카이빙 섬 별로 report 조회 api
//    @GetMapping
//    public ResponseDTO<?> getAllReports(@RequestParam Long island) {
//        return reportService.getReports(island);
//    }

    //    public List<Report> getAllReports() {}
}
