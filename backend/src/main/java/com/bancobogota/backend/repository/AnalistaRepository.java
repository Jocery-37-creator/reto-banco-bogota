package com.bancobogota.backend.repository;

import com.bancobogota.backend.model.Analista;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AnalistaRepository extends JpaRepository<Analista, Long> {
    Optional<Analista> findByUsuario(String usuario);
}
