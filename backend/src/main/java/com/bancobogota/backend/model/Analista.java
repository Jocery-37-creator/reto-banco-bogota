package com.bancobogota.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "analistas") // Nombre en la base de datos
public class Analista {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Estrategia de creacion ID JPA
    private Long id;

    @Column(name = "nombre_completo", nullable = false)
    private String nombre;

    @Column(name = "usuario", nullable = false, unique = true)
    private String usuario;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;
}
