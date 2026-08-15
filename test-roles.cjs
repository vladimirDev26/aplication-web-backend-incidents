const jwt = require('jsonwebtoken');
const secret = 'J5StapAXlgziZfzebZD5MXGRINoF2ygxYsF19Mwg94Z';
const roles = ['Administrador', 'Jefe', 'Tecnico', 'Usuario Final'];
(async () => {
  for (const rol of roles) {
    const token = jwt.sign({ sub: 1, correo: 'x@x.com', id_rol: 1, rol_nombre: rol }, secret, { expiresIn: '1h' });
    const res = await fetch('http://localhost:3000/api/tickets?pageSize=1000', {
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await res.json();
    const items = data.items || [];
    const inactivos = items.filter(t => (t.estado_registro ?? 1) === 2).length;
    const totalInactivos = data.totalInactivos || '?';
    console.log(`${rol.padEnd(14)} -> status ${res.status} total ${data.total} inactivos_en_lista ${inactivos} todos=${items.length}`);
  }
})().catch(e => { console.error(e.message); process.exit(1); });
