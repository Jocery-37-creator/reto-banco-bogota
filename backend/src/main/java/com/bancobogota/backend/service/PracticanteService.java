package com.bancobogota.backend.service;

import com.bancobogota.backend.dto.PracticanteDTO;
import com.bancobogota.backend.model.Practicante;
import com.bancobogota.backend.repository.PracticanteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class PracticanteService {

    private final String subida_dir = "uploads/"; // Directorio de subida de HV

    private final PracticanteRepository practicanteRepository;

    public PracticanteService(PracticanteRepository repository) {
        this.practicanteRepository = repository; // DI
    }

    public Practicante registrarPracticante(PracticanteDTO dto) throws IOException {
        Path uploadPath = Paths.get(subida_dir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        } // Crear directorio si no existe

        MultipartFile archivo = dto.getHojaDeVida();
        String nombreArchivoUnico = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename();
        Path filePath = uploadPath.resolve(nombreArchivoUnico);

        Files.copy(archivo.getInputStream(), filePath);

        // Mapeo
        Practicante nuevoPracticante = new Practicante();
        nuevoPracticante.setNombreCompleto(dto.getNombreCompleto());
        nuevoPracticante.setCorreoElectronico(dto.getCorreoElectronico());
        nuevoPracticante.setCarreraUniversitaria(dto.getCarreraUniversitaria());
        nuevoPracticante.setSemestreActual(dto.getSemestreActual());
        nuevoPracticante.setRutaHojaVida(nombreArchivoUnico);

        return practicanteRepository.save(nuevoPracticante);

    }

    public List<Practicante> obtenerTodos() {
        return practicanteRepository.findAll();
    }

    public Practicante actualizarEstado(Long id, String nuevoEstado) {
        Practicante practicante = practicanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practicante no encontrado"));

        practicante.setEstado(nuevoEstado);
        return practicanteRepository.save(practicante);
    }

    public Practicante obtenerPracticanteId(Long id){
        return practicanteRepository.findById(id).orElseThrow(() -> new RuntimeException("Practicante no encontrado"));
    }
}


