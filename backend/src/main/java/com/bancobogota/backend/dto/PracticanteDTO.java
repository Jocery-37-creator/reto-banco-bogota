package com.bancobogota.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PracticanteDTO {

    @NotBlank(message = "El nombre completo no puede estar vacío")
    private String nombreCompleto;

    @NotBlank(message = "El correo electrónico no puede estar vacío")
    @Email(message = "El formato del correo es inválido")
    private String correoElectronico;

    private String carreraUniversitaria;

    private Integer semestreActual;

    @NotNull(message = "Debe adjuntar su hoja de vida en formato PDF")
    private MultipartFile hojaDeVida; // Aquí recibiremos el archivo físico
}
