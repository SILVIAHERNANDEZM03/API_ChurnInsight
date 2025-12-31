package com.churninsight.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChurnStatsDTO {

    private int clientesRiesgo;
    private int clientesNoRiesgo;

    private List<String> meses;
    private List<Double> probabilidadPromedio;
}
