package com.churninsight.api.dto;

import lombok.Data;

@Data
public class StatsItemDTO {

    private String label;
    private double churnProbability;
    private double notChurnProbability;
    private int usersCount;
}
