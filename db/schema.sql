-- =========================================================
-- schema.sql
-- Base de datos: fulbitonuevo
-- Estructura del sistema de reservas de canchas
-- =========================================================

CREATE DATABASE IF NOT EXISTS fulbitonuevo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fulbitonuevo;

-- 1. TABLA CANCHA
CREATE TABLE IF NOT EXISTS CANCHA (
    id_cancha INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_superficie VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio_por_hora DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- 2. TABLA HORARIO
CREATE TABLE IF NOT EXISTS HORARIO (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_cancha INT NOT NULL,
    dia_semana VARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT fk_horario_cancha
        FOREIGN KEY (id_cancha) REFERENCES CANCHA(id_cancha),
    CONSTRAINT chk_horario
        CHECK (hora_fin > hora_inicio),
    CONSTRAINT uq_horario
        UNIQUE (id_cancha, dia_semana, hora_inicio, hora_fin)
) ENGINE=InnoDB;

-- 3. TABLA RESERVA
CREATE TABLE IF NOT EXISTS RESERVA (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_horario INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    telefono_cliente VARCHAR(30) NOT NULL,
    email_cliente VARCHAR(100),
    estado VARCHAR(20) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reserva_horario
        FOREIGN KEY (id_horario) REFERENCES HORARIO(id_horario),
    CONSTRAINT uq_reserva_horario_fecha
        UNIQUE (id_horario, fecha_reserva)
) ENGINE=InnoDB;

-- 4. TABLA CONTACTO
-- id_reserva admite NULL para consultas generales sin reserva asociada.
CREATE TABLE IF NOT EXISTS CONTACTO (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    asunto VARCHAR(150),
    mensaje TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT fk_contacto_reserva
        FOREIGN KEY (id_reserva) REFERENCES RESERVA(id_reserva)
) ENGINE=InnoDB;
