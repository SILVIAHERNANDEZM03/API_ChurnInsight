package com.churninsight.api.controller;

import com.churninsight.api.dto.ChurnRequestDTO;
import com.churninsight.api.dto.ClientProfileDTO;
import com.churninsight.api.dto.PredictionResponseDTO;
import com.churninsight.api.service.PredictionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/predict")
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping
    public PredictionResponseDTO predict(
            @RequestBody ChurnRequestDTO request) {

        return predictionService.predict(request);
    }

    @GetMapping("/client/{id}")
    public PredictionResponseDTO predictByClientId(@PathVariable String id) {

        // MOCK de datos cargados desde "modelo"
        ClientProfileDTO client = new ClientProfileDTO(
                52,
                "Other",
                "Basic",
                1.1,
                30,
                "Asia"
        );

        return new PredictionResponseDTO(
                "Cancela",
                0.78,
                client
        );
    }

}
