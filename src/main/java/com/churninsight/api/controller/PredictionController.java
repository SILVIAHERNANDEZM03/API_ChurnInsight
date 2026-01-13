package com.churninsight.api.controller;

import com.churninsight.api.dto.ModelDataDTO;
import com.churninsight.api.dto.ModelPredictionDTO;
import com.churninsight.api.dto.PredictionResponseDTO;
import com.churninsight.api.service.PredictionService;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/predict")
@CrossOrigin(origins = "*")
@Tag(name = "Prediction Management", description = "APIs para manejar las predicciones del modelo")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }
    //predicción manual
    @Operation(summary = "Predicción manual modelo", description = "Endpoint para realizar predicción manual con el modelo de ML")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Predicción del modelo se realizó correctamente",
                    content = @Content(schema = @Schema(implementation = PredictionResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos de petición no válidos",
                    content = @Content(schema = @Schema()))
    })
    @PostMapping
    public ModelPredictionDTO predict(@RequestBody ModelDataDTO request) {
        return predictionService.predict(request);
    }

    //predicción por id cliente
    @Operation(summary = "Predicción por ID", description = "Endpoint para realizar predicción con el modelo de ML basado en los datos de un cliente(ID)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Predicción del modelo se realizó correctamente",
                    content = @Content(schema = @Schema(implementation = PredictionResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos de petición no válidos",
                    content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", description = "No se encontró información con el ID otorgado",
                    content = @Content(schema = @Schema()))
    })
    @GetMapping("/client/{publicId}")
    public PredictionResponseDTO predictByPublicId(
            @PathVariable String publicId) {

        return predictionService.predictByPublicId(publicId);
    }
}
