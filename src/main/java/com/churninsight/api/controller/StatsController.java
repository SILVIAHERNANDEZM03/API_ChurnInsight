package com.churninsight.api.controller;

import com.churninsight.api.dto.ModelDataDTO;
import com.churninsight.api.dto.StatsResponseDTO;
import com.churninsight.api.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/probability")
@CrossOrigin(origins = "*")
@Tag(name = "Statistics Management", description = "APIs para manejar las estadísticas del proyecto")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @Operation(summary = "Estadísticas de proporción por género", description = "Endpoint para obtener la proporción churn/no churn por género")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estadistica de la información del modelo se realizó correctamente",
                    content = @Content(schema = @Schema(implementation = StatsResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "No se encontró información",
                    content = @Content(schema = @Schema()))
    })
    @GetMapping("/gender")
    public StatsResponseDTO genderStats() {
        return statsService.getStats("gender");
    }

    @Operation(summary = "Estadísticas de proporción por región", description = "Endpoint para obtener la proporción churn/no churn por región")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estadistica de la información del modelo se realizó correctamente",
                    content = @Content(schema = @Schema(implementation = StatsResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "No se encontró información",
                    content = @Content(schema = @Schema()))
    })
    @GetMapping("/region")
    public StatsResponseDTO regionStats() {
        return statsService.getStats("region");
    }

    @Operation(summary = "Estadísticas de proporción por suscripción", description = "Endpoint para obtener la proporción churn/no churn por suscripción")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estadistica de la información del modelo se realizó correctamente",
                    content = @Content(schema = @Schema(implementation = StatsResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "No se encontró información",
                    content = @Content(schema = @Schema()))
    })
    @GetMapping("/subscription")
    public StatsResponseDTO subscriptionStats() {
        return statsService.getStats("subscription");
    }

    @Operation(summary = "Estadísticas de proporción por edad", description = "Endpoint para obtener la proporción churn/no churn por edad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estadistica de la información del modelo se realizó correctamente",
                    content = @Content(schema = @Schema(implementation = StatsResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos de petición no válidos",
                    content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", description = "No se encontró información",
                    content = @Content(schema = @Schema()))
    })
    @GetMapping("/age")
    public StatsResponseDTO ageStats() {
        return statsService.getStats("age");
    }
}
