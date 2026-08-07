import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import type { Response } from 'express';
import { AdjuntosService } from './adjuntos.service';

@Controller('adjuntos')
export class AdjuntosController {
  constructor(private readonly service: AdjuntosService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('ticket/:idTicket')
  findByTicket(@Param('idTicket') idTicket: string) {
    return this.service.findByTicket(+idTicket);
  }

  @Get('archivo/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const result = await this.service.download(+id);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${result.nombreOriginal}"`,
    });
    result.streamable.getStream().pipe(res);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id_ticket?: number | null },
  ) {
    if (!file) throw new Error('No se envió archivo');

    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    const extension = file.originalname.split('.').pop();
    const nombreArchivo = `${randomUUID()}.${extension}`;

    const stream = createWriteStream(join(uploadDir, nombreArchivo));
    await new Promise<void>((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', resolve);
      stream.write(file.buffer);
      stream.end();
    });

    return this.service.create({
      id_ticket: body.id_ticket ?? undefined,
      nombre_original: file.originalname,
      nombre_archivo: nombreArchivo,
      extension,
      tamano: String(file.size),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
