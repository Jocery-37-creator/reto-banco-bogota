package com.bancobogota.backend.service;

import com.bancobogota.backend.model.Practicante;
import com.bancobogota.backend.repository.PracticanteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PracticanteServiceTest {

    @Mock
    private PracticanteRepository practicanteRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PracticanteService practicanteService;

    @Test
    void obtenerPracticanteId_DebeRetornarPracticante_CuandoExiste() {
        // ARRANGE Escenario
        Long idBuscado = 1L;
        Practicante practicanteFalso = new Practicante();
        practicanteFalso.setId(idBuscado);
        practicanteFalso.setNombreCompleto("Juan Pérez");

        // Devuelve el practicante falso cuando busca el ID 1
        when(practicanteRepository.findById(idBuscado)).thenReturn(Optional.of(practicanteFalso));
        System.out.println("[TEST] ID inventado: " + idBuscado);

        // ACT Ejecucion
        Practicante resultado = practicanteService.obtenerPracticanteId(idBuscado);

        // ASSERT (Verificar)
        assertNotNull(resultado); // El resultado no debe ser nulo
        assertEquals("Juan Pérez", resultado.getNombreCompleto()); // El nombre debe coincidir
        System.out.println("[TEST] NOMBRES COINCIDIDOS");

        //Verificacion de llamado
        verify(practicanteRepository, times(1)).findById(idBuscado);
    }

    @Test
    void obtenerPracticanteId_DebeLanzarExcepcion_CuandoNoExiste() {
        // ARRANGE Escenario
        Long idBuscado = 99L;

        // Instrucción al clon: "Cuando busquen el ID 99, devuelve un Optional vacío (no existe)"
        when(practicanteRepository.findById(idBuscado)).thenReturn(Optional.empty());

        // ACT & ASSERT Ejecucion y verificacion
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            practicanteService.obtenerPracticanteId(idBuscado);
        });

        System.out.println("[TEST] " + excepcion.getMessage());
        assertEquals("Practicante no encontrado", excepcion.getMessage());
    }
}