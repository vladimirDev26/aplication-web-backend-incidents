-- Tablas que ya tienen activo (booleano) → convertir a estado_registro INT
ALTER TABLE areas ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
UPDATE areas SET estado_registro = CASE WHEN activo THEN 1 ELSE 2 END;
ALTER TABLE areas DROP COLUMN IF EXISTS activo;

ALTER TABLE categorias ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
UPDATE categorias SET estado_registro = CASE WHEN activo THEN 1 ELSE 2 END;
ALTER TABLE categorias DROP COLUMN IF EXISTS activo;

ALTER TABLE equipos ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
UPDATE equipos SET estado_registro = CASE WHEN activo THEN 1 ELSE 2 END;
ALTER TABLE equipos DROP COLUMN IF EXISTS activo;

ALTER TABLE roles ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
UPDATE roles SET estado_registro = CASE WHEN activo THEN 1 ELSE 2 END;
ALTER TABLE roles DROP COLUMN IF EXISTS activo;

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
UPDATE usuarios SET estado_registro = CASE WHEN activo THEN 1 ELSE 2 END;
ALTER TABLE usuarios DROP COLUMN IF EXISTS activo;

-- Tablas sin activo → agregar estado_registro
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
ALTER TABLE historial ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
ALTER TABLE prioridades ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;
ALTER TABLE estados ADD COLUMN IF NOT EXISTS estado_registro INT NOT NULL DEFAULT 1;