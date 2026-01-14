package com.churninsight.api.service;

import com.churninsight.api.dto.StatsItemDTO;
import com.churninsight.api.dto.StatsResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL =
            "https://definitely-poetry-few-bachelor.trycloudflare.com";

    public StatsResponseDTO getStats(String type) {

        String url = BASE_URL + "/probability/" + type;

        try {
            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            if (response == null) {
                return new StatsResponseDTO();
            }

            StatsResponseDTO dto = new StatsResponseDTO();

            List<Map<String, Object>> rawList =
                    (List<Map<String, Object>>) response.get("data");

            if (rawList == null) {
                return dto;
            }

            List<StatsItemDTO> items = new ArrayList<>();

            for (Map<String, Object> item : rawList) {

                StatsItemDTO stat = new StatsItemDTO();

                stat.setLabel(item.get("label").toString());
                stat.setChurnProbability(
                        ((Number) item.get("churnProbability")).doubleValue()
                );
                stat.setNotChurnProbability(
                        ((Number) item.get("notChurnProbability")).doubleValue()
                );
                stat.setUsersCount(
                        ((Number) item.get("usersCount")).intValue()
                );

                items.add(stat);
            }

            dto.setData(items);
            return dto;

        } catch (Exception e) {
            return new StatsResponseDTO();
        }
    }
}
