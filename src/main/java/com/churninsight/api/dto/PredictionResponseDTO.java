package com.churninsight.api.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PredictionResponseDTO {
    private String prevision;
    private Double probabilidad;
    private ClientProfileDTO client;

}

