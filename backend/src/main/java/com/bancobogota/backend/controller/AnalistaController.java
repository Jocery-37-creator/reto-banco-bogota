package com.bancobogota.backend.controller;

import com.bancobogota.backend.dto.LoginAnalistaDTO;
import com.bancobogota.backend.service.AnalistaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analistas")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalistaController {

    private final AnalistaService service;

    public AnalistaController(AnalistaService service) {
        this.service = service;
    }
    // Validar credenciales
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginAnalistaDTO loginDTO) {
        boolean esValido = service.validarCredenciales(loginDTO.getUsuario(), loginDTO.getContrasena());

        if (esValido) {
            return ResponseEntity.ok("Login exitoso");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
        }
    }
}
