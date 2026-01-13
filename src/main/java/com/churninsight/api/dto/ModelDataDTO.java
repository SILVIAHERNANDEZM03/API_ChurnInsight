package com.churninsight.api.dto;

import lombok.Data;

@Data
public class ModelDataDTO {
    private Integer age;
    private String gender;
    private String subscription_type;
    private Double watch_hours;
    private String region;
    private Integer number_of_profiles;
    private String payment_method;
    private String device;
}
