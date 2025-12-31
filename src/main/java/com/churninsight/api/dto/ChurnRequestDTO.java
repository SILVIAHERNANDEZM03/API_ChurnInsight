package com.churninsight.api.dto;

import lombok.Data;

@Data
public class ChurnRequestDTO {

    private int age;
    private String gender;
    private String subscription_type;
    private double watch_hours;
    private int last_login_days;
}

