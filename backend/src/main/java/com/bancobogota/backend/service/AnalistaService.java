package com.bancobogota.backend.service;

import com.bancobogota.backend.model.Analista;
import com.bancobogota.backend.repository.AnalistaRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AnalistaService {

    private final AnalistaRepository repository;

    public AnalistaService(AnalistaRepository repository) {
        this.repository = repository;
    }

    public boolean validarCredenciales(String usuario, String contrasena) {
        Optional<Analista> analistaOpt = repository.findByUsuario(usuario);

        if (analistaOpt.isPresent()) {
            // Comparacion
            return analistaOpt.get().getContrasena().equals(contrasena);
        }

        return false; // El usuario no existe
    }
}
