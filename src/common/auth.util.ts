import type { Request } from 'express';

export function soloActivosPara(req: Request): boolean {
  const rol = (req as { user?: { rol_nombre?: string } }).user?.rol_nombre;
  return rol !== 'Administrador';
}