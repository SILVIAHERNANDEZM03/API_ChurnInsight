package com.churninsight.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientProfileDTO {
    private int age;
    private String gender;
    private String subscription_type;
    private double watch_hours;
    private int last_login_days;
    private String region;


}

