-- SLA por prioridad en minutos.
-- Agrega las columnas de SLA a prioridades y setea los valores según el SLA de la empresa.
-- Ejecutar contra la base de datos:
--   psql -U postgres -d db_sistema_incidencias -f sla_prioridades.sql

ALTER TABLE prioridades ADD COLUMN IF NOT EXISTS sla_respuesta_min INT NULL;
ALTER TABLE prioridades ADD COLUMN IF NOT EXISTS sla_resolucion_min INT NULL;

UPDATE prioridades SET sla_respuesta_min = 10,  sla_resolucion_min = 60   WHERE LOWER(TRANSLATE(nombre, 'áéíóú', 'aeiou')) LIKE '%critic%';
UPDATE prioridades SET sla_respuesta_min = 30,  sla_resolucion_min = 120  WHERE lower(nombre) = 'alta';
UPDATE prioridades SET sla_respuesta_min = 120, sla_resolucion_min = 240  WHERE lower(nombre) = 'media';
UPDATE prioridades SET sla_respuesta_min = 240, sla_resolucion_min = 1440 WHERE lower(nombre) = 'baja';