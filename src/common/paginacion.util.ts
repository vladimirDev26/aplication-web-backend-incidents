export function obtenerParametrosPaginacion(
  filtros: Record<string, string> = {},
  pageSizePorDefecto = 10,
) {
  const pagina = Math.max(Number(filtros.pagina) || 1, 1);
  const pageSize = Math.max(Number(filtros.pageSize) || pageSizePorDefecto, 1);
  return {
    pagina,
    pageSize,
    offset: (pagina - 1) * pageSize,
  };
}

export function paginacionMeta(
  pagina: number,
  pageSize: number,
  total: number,
) {
  return {
    pagina,
    pageSize,
    total,
    totalPaginas: Math.ceil(total / pageSize),
    offset: (pagina - 1) * pageSize,
  };
}
