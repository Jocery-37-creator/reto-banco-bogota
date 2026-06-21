package com.bancobogota.backend.repository;

import com.bancobogota.backend.model.Practicante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PracticanteRepository extends JpaRepository<Practicante, Long>{
    // Metodos heredados de la interfaz JpaRepository
}
