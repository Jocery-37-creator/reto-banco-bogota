package com.bancobogota.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "practicantes") // Nombre en la base de datos
public class Practicante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Estrategia de creacion ID JPA
    private Long id;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "correo_electronico", nullable = false)
    private String correoElectronico;

    @Column(name = "carrera_universitaria")
    private String carreraUniversitaria;

    @Column(name = "semestre_actual")
    private Integer semestreActual;

    @Column(name = "ruta_hoja_vida")
    private String rutaHojaVida;

    @Column(nullable = false)
    private String estado = "Pendiente";
}
