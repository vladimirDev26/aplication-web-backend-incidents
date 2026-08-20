-- Módulo de sedes de la empresa.
-- Crea la tabla sedes, inserta las 4 sedes actuales y agrega la columna id_sede a usuarios.
-- Ejecutar contra la base de datos:
--   psql -U postgres -d db_sistema_incidencias -f sedes.sql

CREATE TABLE IF NOT EXISTS sedes (
  id_sede SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado_registro INT NOT NULL DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sedes (nombre, descripcion)
SELECT v.nombre, v.descripcion
FROM (VALUES
  ('OPB', 'Oficina principal'),
  ('CHACARILLA', 'Sede Chacarilla'),
  ('AMALFI', 'Sede Amalfi'),
  ('1257', 'Sede 1257')
) AS v(nombre, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM sedes s WHERE s.nombre = v.nombre);

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id_sede INT NULL;
