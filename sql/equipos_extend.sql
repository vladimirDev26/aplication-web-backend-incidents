-- Extiende la tabla equipos con los campos nuevos por tipo de equipo.
-- Ejecutar contra la base db_sistema_incidencias:
--   psql -U postgres -d db_sistema_incidencias -f equipos_extend.sql

ALTER TABLE equipos
  ADD COLUMN IF NOT EXISTS tipo_impresora VARCHAR(50),
  ADD COLUMN IF NOT EXISTS imei VARCHAR(50),
  ADD COLUMN IF NOT EXISTS numero_telefonico VARCHAR(20),
  ADD COLUMN IF NOT EXISTS version_so VARCHAR(50),
  ADD COLUMN IF NOT EXISTS almacenamiento VARCHAR(50),
  ADD COLUMN IF NOT EXISTS operador VARCHAR(50);

-- IP y MAC ya no se usan en el sistema.
ALTER TABLE equipos
  DROP COLUMN IF EXISTS direccion_ip,
  DROP COLUMN IF EXISTS mac;