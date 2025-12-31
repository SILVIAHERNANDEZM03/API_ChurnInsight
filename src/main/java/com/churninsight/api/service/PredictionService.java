package com.churninsight.api.service;

import com.churninsight.api.dto.ChurnRequestDTO;
import com.churninsight.api.dto.ClientProfileDTO;
import com.churninsight.api.dto.PredictionResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class PredictionService {

    public PredictionResponseDTO predict(ChurnRequestDTO req) {

        double score = 0;

        if (req.getWatch_hours() < 2) score += 0.3;
        if (req.getLast_login_days() > 20) score += 0.4;
        if ("Basic".equals(req.getSubscription_type())) score += 0.2;

        double prob = Math.min(score, 1.0);

        ClientProfileDTO client = new ClientProfileDTO(
                req.getAge(),
                req.getGender(),
                req.getSubscription_type(),
                req.getWatch_hours(),
                req.getLast_login_days(),
                "N/A"
        );

        return new PredictionResponseDTO(
                prob > 0.5 ? "Cancela" : "No cancela",
                prob,
                client
        );
    }
}
