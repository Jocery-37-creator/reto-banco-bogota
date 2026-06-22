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
* **Arquitectura Multicapa:** Separación estricta por responsabilidades (`Controller`, `Service`, `Repository`, `Model`, `DTO`, `Config`).
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
> **Nota de Entorno:** Este proyecto fue desarrollado, contenerizado y probado nativamente en un entorno **Windows (10/11)**. Si bien las tecnologías utilizadas (Java, Node.js, Docker) son multiplataforma, los comandos de terminal descritos en esta guía están optimizados para ser ejecutados en PowerShell o CMD (Windows).

Para ejecutar este proyecto en tu máquina local, asegúrate de tener instalado:
* **Java JDK 21**
* **Node.js** (v18+)
* **Docker Desktop** (Para levantar la base de datos PostgreSQL)
* **Maven**
* **Administrador de bases de datos (postgreSQL 17)**

## Guia de Instalación de Tecnologías Requeridas (Prerrequisitos)

Para ejecutar este proyecto desde cero, asegúrese de tener instaladas las siguientes herramientas en su sistema operativo:

1. **Java Development Kit (JDK) 21:**
   * Descargue el instalador desde [Oracle](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html) o use distribuciones como Amazon Corretto.
   * Verifique la instalación ejecutando en su terminal: `java -version`
   * Valide que las variables de entorno y el path esta correctamente definido en el sistema, para validarlo entrar a la configuracion avanzada del sistema.
2. **Node.js y npm:**
   * Descargue la versión LTS (v18 o superior) desde la [página oficial de Node.js](https://nodejs.org/).
   * Verifique la instalación: `node -v` y `npm -v`
3. **Docker Desktop:**
   * Requerido para levantar la base de datos sin configuraciones manuales. Descárguelo desde [Docker](https://www.docker.com/products/docker-desktop/).
   * Asegúrese de que el motor de Docker esté corriendo en segundo plano antes de iniciar el proyecto.
4. **Apache Maven:**
   * Herramienta de construcción para el Back-End. Si utiliza un IDE como IntelliJ IDEA o Eclipse, Maven ya viene integrado.

---

## ⚙️ Guía de ejecución

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

### Paso 3: Instalar y Desplegar el Cliente (Front-End)
Abra una tercera terminal, navega al directorio del cliente, instale los paquetes de Node y arranque el servidor de desarrollo de Vite:
```bash
cd frontend
npm install
npm run dev
```
El compilador en tiempo real desplegará la interfaz gráfica del usuario, la cual estará accesible inmediatamente desde su navegador web en la dirección http://localhost:5173.

---
## Pruebas Unitarias
Para validar que los cambios estructurales no afecten las funcionalidades core de la aplicación, puede correr las pruebas unitarias automatizadas ejecutando el motor de Maven de la siguiente manera:
```
cd backend
mvn test
```
Se realizaron dos pruebas unitarias sencillas que establecen conexion con la logica de negocio interna de la gestion de practicantes. 

---

## Evidencias Visuales y Capturas de Pantalla

> **Nota:** Para asegurar la correcta visualización de las imágenes en GitHub, guarde sus capturas en una carpeta llamada `docs/` o `assets/` en la raíz de su proyecto local y apunte las rutas de la siguiente manera.

### ⚙️ Sección A: Ejecución Técnica del Sistema

#### 1. Infraestructura Activa en Docker (Base de Datos)
Muestra los contenedores de PostgreSQL inicializados y corriendo correctamente en segundo plano.
![Contenedores de Docker](docs/R_EJECUCION_DOCKER.png)

#### 2. Servidor Spring Boot en Ejecución (Tomcat Puerto 8080)
Evidencia del Back-End compilando con éxito y conectándose a la base de datos contenerizada.
![Arranque del Back-End](docs/R_ARRANQUE_SPRING.png)

#### 3. Suite de Pruebas Unitarias Aprobada (JUnit & Mockito)
Captura del comando `mvn test` arrojando un resultado exitoso (`BUILD SUCCESS`) con cero fallos en memoria RAM.
![Resultado de Pruebas Unitarias](docs/R_PRUEBAS_SUCCESS.png)

---

### 💻 Sección B: Interfaces de Usuario e Integración (UI/UX)

#### 4. Formulario de Registro (Rol Practicante)
Vista completa de la interfaz del aspirante con las validaciones de campos obligatorios activas.
![Formulario de Practicantes](docs/R_VISTA_FORMULARIO.png)

#### 5. Confirmación de Postulación en Tiempo Real (Evidencia Correo SMTP)
Captura de pantalla de la bandeja de entrada real de Gmail mostrando la notificación automatizada despachada por el servidor.
![Correo Electrónico Recibido](docs/R_EVIDENCIA_CORREO.png)

#### 6. Portal de Selección e Inserción de Datos (Rol Analista)
Demostración de la tabla dinámica con el buscador unificado por texto y el sistema de ordenamiento por cabeceras interactivo.
![Panel de Control de Analistas](docs/R_DASHBOARD_ANALISTA.png)





