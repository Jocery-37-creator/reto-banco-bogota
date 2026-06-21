package com.bancobogota.backend.controller;

import com.bancobogota.backend.dto.PracticanteDTO;
import com.bancobogota.backend.model.Practicante;
import com.bancobogota.backend.service.PracticanteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController // API REST
@RequestMapping("api/practicantes")
@CrossOrigin(origins = "http://localhost:5173")
public class PracticanteController {

    private final PracticanteService service;

    public PracticanteController(PracticanteService service) {
        this.service = service; //DI
    }

    //Endpoint POST: Recibe formulario de registro de practicante
    @PostMapping
    public ResponseEntity<Practicante> registrarPracticante(@Valid @ModelAttribute PracticanteDTO dto) throws IOException {
        Practicante nuevoPracticante = service.registrarPracticante(dto);
        return new ResponseEntity<>(nuevoPracticante, HttpStatus.CREATED);
    }

    // Endpoint GET: Listar todos los practicantes registrados
    @GetMapping
    public ResponseEntity<List<Practicante>> obtenerTodos() {
        List<Practicante> practicantes = service.obtenerTodos();
        return new ResponseEntity<>(practicantes, HttpStatus.OK);
    }

    // Endpoint PUT: Actualizar estado de practicante
    @PutMapping("/{id}/estado")
    public ResponseEntity<Practicante> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String nuevoEstado = request.get("estado");
        Practicante practicanteActualizado = service.actualizarEstado(id, nuevoEstado);
        return new ResponseEntity<>(practicanteActualizado, HttpStatus.OK);
    }

    // Endpoint GET: Descargar hoja de vida
    @GetMapping("/{id}/cv")
    public ResponseEntity<?> descargarCV(@PathVariable Long id) {
        try {
            // 1. Usamos tu metodo
            Practicante practicante = service.obtenerPracticanteId(id);

            // 2. Verificamos si hay ruta en la base de datos
            if (practicante.getRutaHojaVida() == null || practicante.getRutaHojaVida().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Error: El practicante existe, pero la columna 'ruta_hoja_vida' está vacía (NULL) en la base de datos.");
            }

            // 3. Verificamos si el archivo físico realmente existe en tu computadora
            Path filepath = Paths.get("uploads").resolve(practicante.getRutaHojaVida()).normalize();
            Resource resource = new UrlResource(filepath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Error: La ruta está en la base de datos (" + practicante.getRutaHojaVida() + "), pero el archivo PDF no se encuentra físicamente en esa carpeta de tu disco duro.");
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"Hoja_Vida_" + id + ".pdf\"")
                    .body(resource);

        } catch (RuntimeException e) {
            // Captura la excepción que lanzaste en tu service ("Practicante no encontrado")
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: No existe ningún practicante con el ID " + id + " en la base de datos.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }
}

