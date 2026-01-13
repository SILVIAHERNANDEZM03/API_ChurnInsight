package com.churninsight.api.controller;

import com.churninsight.api.dto.ModelDataDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Tag(name = "Home Management", description = "APIs para manejar el frontend del proyecto")
public class HomeController {

    @Operation(summary = "Endpoint de Frontend", description = "Endpoint encargado de manejar el Frontend del proyecto")
    @GetMapping("/")
    public String home() {

        return "index";
    }
}
