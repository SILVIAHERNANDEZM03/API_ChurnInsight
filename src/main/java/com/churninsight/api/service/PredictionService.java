package com.churninsight.api.service;

import com.churninsight.api.dto.ModelDataDTO;
import com.churninsight.api.dto.ModelPredictionDTO;
import com.churninsight.api.dto.PredictionResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class PredictionService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String MODEL_PREDICT_URL =
            "http://168.197.48.239:8000/predict";

    private static final String MODEL_ID_URL =
            "http://168.197.48.239:8000/item/predictions/";

    // FORMULARIO MANUAL
    public ModelPredictionDTO predict(ModelDataDTO request) {
        return restTemplate.postForObject(
                MODEL_PREDICT_URL,
                request,
                ModelPredictionDTO.class
        );
    }

    // BÚSQUEDA POR ID
    public PredictionResponseDTO predictByPublicId(String publicId) {

        String url = MODEL_ID_URL + publicId;

        try {
            ResponseEntity<Map> response =
                    restTemplate.getForEntity(url, Map.class);

            Map body = response.getBody();

            Map prediction = (Map) body.get("prediction");
            Map probabilities = (Map) prediction.get("probabilities");

            int pred = (int) prediction.get("prediction");
            double churnProb =
                    ((Number) probabilities.get("churn")).doubleValue();

            Map client =
                    ((List<Map>) body.get("data")).get(0);

            return new PredictionResponseDTO(
                    pred,
                    churnProb,
                    client
            );

        } catch (HttpClientErrorException.NotFound ex) {
            // Intentar extraer el campo 'detail' del body JSON del servicio externo
            String detailMsg = ex.getResponseBodyAsString();
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode node = mapper.readTree(detailMsg);
                if (node.has("detail")) {
                    detailMsg = node.get("detail").asText();
                }
            } catch (Exception ignore) {
                // fallback: usar el body tal cual
            }

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, detailMsg);
        }
    }
}
