package com.bancobogota.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoConfirmacion(String destino, String nombrePracticante) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom("josejesuscespedes@gmail.com");
            message.setTo(destino);
            message.setSubject("Confirmación de Postulación - Programa de Prácticas Banco de Bogotá");

            message.setText("Hola " + nombrePracticante + ",\n\n" +
                    "Hemos recibido correctamente tu postulación y tu hoja de vida en nuestro Portal de Selección del Centro de Excelencia (CoE).\n\n" +
                    "Nuestro equipo de analistas revisará tu perfil en los próximos días y te notificaremos por este medio si eres seleccionado como Viable.\n\n" +
                    "¡Muchos éxitos en tu proceso!\n\n" +
                    "Cordialmente,\n" +
                    "Talento Humano - Banco de Bogotá");

            mailSender.send(message);
            System.out.println("======> ¡Correo de confirmación enviado con éxito a: " + destino + "!");
        } catch (Exception e) {
            System.err.println("======> Error al enviar el correo: " + e.getMessage());
        }
    }
}

