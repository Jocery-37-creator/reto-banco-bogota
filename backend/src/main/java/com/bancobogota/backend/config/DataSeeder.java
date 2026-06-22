package com.bancobogota.backend.config;

import com.bancobogota.backend.model.Analista;
import com.bancobogota.backend.repository.AnalistaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner inicializarBaseDeDatos(AnalistaRepository analistaRepository) {
        return args -> {
            // Se verifica que no existan registros en la tabla
            if (analistaRepository.count() == 0) {

                Analista analista1 = new Analista();
                analista1.setNombre("Maria Perez");
                analista1.setUsuario("maria");
                analista1.setContrasena("admin123");

                Analista analista2 = new Analista();
                analista2.setNombre("Diana Garcia");
                analista2.setUsuario("diana");
                analista2.setContrasena("admin123");

                Analista analista3 = new Analista();
                analista3.setNombre("Camilo Cortez");
                analista3.setUsuario("camilo");
                analista3.setContrasena("admin123");

                // Se guardan los registros en la base de datos
                analistaRepository.save(analista1);
                analistaRepository.save(analista2);
                analistaRepository.save(analista3);

            } else {
                System.out.println(" [DataSeeder] Los analistas ya existen en la base de datos");
            }
        };
    }
}