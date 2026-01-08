package com.churninsight.api.controller;

import com.churninsight.api.dto.StatsResponseDTO;
import com.churninsight.api.service.StatsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/probability")
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("gender")
    public StatsResponseDTO genderStats() {
        return statsService.getStats("gender");
    }

    @GetMapping("/region")
    public StatsResponseDTO regionStats() {
        return statsService.getStats("region");
    }

    @GetMapping("/subscription")
    public StatsResponseDTO subscriptionStats() {
        return statsService.getStats("subscription");
    }

    @GetMapping("/age")
    public StatsResponseDTO ageStats() {
        return statsService.getStats("age");
    }
}
