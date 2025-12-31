package com.churninsight.api.controller;

import com.churninsight.api.dto.ChurnStatsDTO;
import com.churninsight.api.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/predict")
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ChurnStatsDTO> getStats() {
        return ResponseEntity.ok(statsService.getMockStats());
    }
}
