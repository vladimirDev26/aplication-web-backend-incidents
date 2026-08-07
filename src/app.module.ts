import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { AreasModule } from './areas/areas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PrioridadesModule } from './prioridades/prioridades.module';
import { EstadosModule } from './estados/estados.module';
import { EquiposModule } from './equipos/equipos.module';
import { TicketsModule } from './tickets/tickets.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { AdjuntosModule } from './adjuntos/adjuntos.module';
import { HistorialModule } from './historial/historial.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || 'localhost',
        port: parseInt(config.get('DB_PORT') || '5432', 10),
        username: config.get('DB_USER') || 'postgres',
        password: config.get('DB_PASSWORD') || 'postgres',
        database: config.get('DB_NAME') || 'incidents',
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    RolesModule,
    AreasModule,
    UsuariosModule,
    CategoriasModule,
    PrioridadesModule,
    EstadosModule,
    EquiposModule,
    TicketsModule,
    ComentariosModule,
    AdjuntosModule,
    HistorialModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
