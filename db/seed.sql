-- =========================================================
-- seed.sql
-- Datos de prueba para la base fulbitonuevo
-- Ejecutar después de schema.sql
-- =========================================================

USE fulbitonuevo;

-- CANCHA: 5 registros
INSERT INTO CANCHA
(id_cancha, nombre, tipo_superficie, descripcion, precio_por_hora, estado)
VALUES
(1, 'Cancha 1', 'Cesped sintetico', 'Futbol 5 techada', 8000.00, 'activa'),
(2, 'Cancha 2', 'Cesped sintetico', 'Futbol 5 al aire libre', 7500.00, 'activa'),
(3, 'Cancha 3', 'Cesped sintetico', 'Futbol 7 con iluminacion LED', 11000.00, 'activa'),
(4, 'Cancha 4', 'Cemento', 'Baby futbol con vestuarios', 6000.00, 'activa'),
(5, 'Cancha 5', 'Cesped natural', 'Futbol 11, en mantenimiento', 18000.00, 'inactiva');

-- HORARIO: 8 registros
INSERT INTO HORARIO
(id_horario, id_cancha, dia_semana, hora_inicio, hora_fin, estado)
VALUES
(1, 1, 'lunes', '18:00:00', '19:00:00', 'activo'),
(2, 1, 'martes', '19:00:00', '20:00:00', 'activo'),
(3, 2, 'miercoles', '20:00:00', '21:00:00', 'activo'),
(4, 2, 'sabado', '16:00:00', '17:00:00', 'activo'),
(5, 3, 'jueves', '21:00:00', '22:00:00', 'activo'),
(6, 3, 'viernes', '20:00:00', '21:00:00', 'activo'),
(7, 4, 'sabado', '18:00:00', '19:00:00', 'activo'),
(8, 5, 'domingo', '10:00:00', '11:00:00', 'inactivo');

-- RESERVA: 8 registros
INSERT INTO RESERVA
(id_reserva, id_horario, fecha_reserva, nombre_cliente,
 telefono_cliente, email_cliente, estado)
VALUES
(1, 1, '2026-11-16', 'Sofia Martinez', '1155550001', 'sofia@ejemplo.com', 'confirmada'),
(2, 2, '2026-11-17', 'Carlos Lopez', '1155550002', 'carlos@ejemplo.com', 'confirmada'),
(3, 3, '2026-11-18', 'Valeria Torres', '1155550003', 'valeria@ejemplo.com', 'pendiente'),
(4, 4, '2026-11-21', 'Martin Acosta', '1155550004', 'martin@ejemplo.com', 'confirmada'),
(5, 5, '2026-11-19', 'Julieta Romero', '1155550005', 'julieta@ejemplo.com', 'cancelada'),
(6, 6, '2026-11-20', 'Nicolas Benitez', '1155550006', 'nicolas@ejemplo.com', 'confirmada'),
(7, 7, '2026-11-21', 'Camila Herrera', '1155550007', 'camila@ejemplo.com', 'pendiente'),
(8, 1, '2026-11-23', 'Sofia Martinez', '1155550001', 'sofia@ejemplo.com', 'confirmada');

-- CONTACTO: 6 registros
-- Las consultas generales no asociadas a una reserva usan id_reserva = NULL.
INSERT INTO CONTACTO
(id_contacto, id_reserva, nombre, email, asunto, mensaje, estado)
VALUES
(1, 3, 'Valeria Torres', 'valeria@ejemplo.com',
 'Seña pendiente', '¿Puedo pagar la seña por transferencia?', 'pendiente'),
(2, 5, 'Julieta Romero', 'julieta@ejemplo.com',
 'Cancelación', 'Cancelé por lluvia, ¿puedo reprogramar el turno?', 'respondido'),
(3, NULL, 'Diego Sosa', 'diego@ejemplo.com',
 'Consulta de precios', '¿Cuánto cuesta la cancha de fútbol 7?', 'respondido'),
(4, NULL, 'Laura Vega', 'laura@ejemplo.com',
 'Horarios', '¿Hasta qué hora atienden?', 'pendiente'),
(5, 7, 'Camila Herrera', 'camila@ejemplo.com',
 'Cambio de horario', '¿Puedo pasar mi reserva para el domingo?', 'pendiente'),
(6, NULL, 'Hugo Paz', 'hugo@ejemplo.com',
 'Eventos', '¿Hacen torneos o eventos de empresa?', 'pendiente');

-- Verificación de cantidad de registros cargados
SELECT 'CANCHA' AS tabla, COUNT(*) AS cantidad FROM CANCHA
UNION ALL
SELECT 'HORARIO', COUNT(*) FROM HORARIO
UNION ALL
SELECT 'RESERVA', COUNT(*) FROM RESERVA
UNION ALL
SELECT 'CONTACTO', COUNT(*) FROM CONTACTO;
