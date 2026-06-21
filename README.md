# Plataforma de Selección de Practicantes - CoE Desarrollo

Una plataforma moderna (Single Page Application) diseñada para el Centro de Excelencia (CoE) del Banco de Bogotá. Permite a los postulantes registrar sus datos y hojas de vida, y a los analistas filtrar y gestionar las candidaturas mediante un panel de control interactivo.

---

## Propósito del Proyecto
Este proyecto fue desarrollado como solución al Reto Técnico "Kata Practicing - Challenge 1".

---

## Arquitectura y Tecnologías

El proyecto está construido bajo una arquitectura de **Monorepo**, dividiendo claramente las responsabilidades entre cliente y servidor.

### Front-End (SPA)
* **React 18 & TypeScript**
* **Vite** 
* **Tailwind CSS**

### Back-End
* **Java 21 & Spring Boot 4.1:** El estándar de la industria bancaria.
* **Arquitectura Multicapa:** Separación estricta por responsabilidades (`Controller`, `Service`, `Repository`, `Model`, `DTO`).
* **Spring Data JPA & Hibernate:** ORM para persistencia de datos orientada a objetos sin SQL manual.
* **Jakarta Validation:** Validación estricta de DTOs en las peticiones HTTP.
* **Lombok:** Reducción de código repetitivo (Boilerplate).
* **Spring Boot Starter Mail:** Integración con servidor SMTP real para notificaciones automáticas por correo electrónico.

### Base de Datos & DevOps
* **PostgreSQL 17:** Base de datos relacional robusta.
* **Docker & Docker Compose:** Infraestructura contenerizada para la base de datos.
* **JUnit 5 & Mockito:** Pruebas unitarias automatizadas con patrón AAA y "Clones" de dependencias (Mocks).

---

## Características Principales y Valores Agregados

1. **Notificaciones Reales por Correo:** Al postularse, el practicante recibe inmediatamente un correo electrónico real de confirmación generado por el Back-End.
2. **Data Grid Inteligente:** El panel del analista no es una tabla estática; permite filtrado en tiempo real por cualquier campo y ordenamiento ascendente/descendente al hacer clic en los encabezados.
3. **Manejo de Archivos Físicos:** Carga y lectura de PDFs (Hojas de vida) mediante `MultipartFile` almacenados de forma local y servidos dinámicamente.
4. **Testing Automatizado:** Cobertura de pruebas unitarias sobre la lógica de negocio (`PracticanteService`) verificando escenarios de éxito y manejo de excepciones.

---

## Requisitos Previos

Para ejecutar este proyecto en tu máquina local, asegúrate de tener instalado:
* **Java JDK 21**
* **Node.js** (v18+)
* **Docker Desktop** (Para levantar la base de datos PostgreSQL)
* **Maven**
* **Administrador de bases de datos (postgreSQL 17)**

---

## ⚙️ Guía de Instalación y Ejecución

Sigue estos 3 pasos exactos para levantar el ecosistema completo:

### Paso 1: Levantar la Base de Datos (Docker)
Abre una terminal en la raíz del proyecto y ejecuta el contenedor de PostgreSQL en segundo plano:
```bash
docker-compose up -d
```
Este comando descargará la imagen oficial de PostgreSQL, creará los volúmenes persistentes y expondrá de forma local el puerto 5432 de manera automatizada.

### Paso 2: Compilar y Lanzar el Servidor (Back-End)
Abra una nueva terminal, navega hacia el directorio del servidor e inicialice la aplicación de Spring Boot
```bash
cd backend
mvn spring-boot:run
```
En su primer arranque, Hibernate leerá el modelo de datos e instanciará automáticamente el esquema de tablas dentro de PostgreSQL. El servidor web quedará escuchando peticiones en http://localhost:8080.


