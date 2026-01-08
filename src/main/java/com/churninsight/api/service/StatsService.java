package com.churninsight.api.service;

import com.churninsight.api.dto.StatsItemDTO;
import com.churninsight.api.dto.StatsResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL = "http://168.197.48.239:8000";

    public StatsResponseDTO getStats(String type) {

        String url = BASE_URL + "/probability/" + type;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        StatsResponseDTO dto = new StatsResponseDTO();
        dto.setTotalUsers((int) response.get("total_users"));

        String key = "grouped_by_" + type;
        if (key.contains("subscription"))  key +="_type";

        List<Map<String, Object>> rawList =
                (List<Map<String, Object>>) response.get(key);

        List<StatsItemDTO> items = rawList.stream().map(item -> {
            StatsItemDTO stat = new StatsItemDTO();

            stat.setLabel(
                    item.get(type.equals("subscription") ? "subscription_type" : type).toString()
            );

            stat.setChurnProbability(
                    ((Number) item.get("churn_probability")).doubleValue()
            );
            stat.setNotChurnProbability(
                    ((Number) item.get("not_churn_probability")).doubleValue()
            );
            stat.setUsersCount(
                    ((Number) item.get("users_count")).intValue()
            );

            return stat;
        }).toList();

        dto.setData(items);
        return dto;
    }
}
