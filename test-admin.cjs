const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, user: 'postgres', password: '123456789', database: 'db_sistema_incidencias' });
(async () => {
  await c.connect();
  const r = await c.query("SELECT u.id_usuario, u.correo, u.id_rol FROM usuarios u JOIN roles r ON r.id_rol=u.id_rol WHERE r.nombre='Administrador' AND u.estado_registro=1 LIMIT 3");
  console.log(JSON.stringify(r.rows));
  await c.end();
})().catch(e => { console.error(e.message); process.exit(1); });
