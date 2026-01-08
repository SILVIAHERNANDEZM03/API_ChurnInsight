package com.churninsight.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class StatsResponseDTO {

    private int totalUsers;
    private List<StatsItemDTO> data;
}
