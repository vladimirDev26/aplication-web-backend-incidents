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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import type { Response } from 'express';
import { AdjuntosService } from './adjuntos.service';

function configurarCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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
    const adjunto = await this.service.findOne(+id);
    if (!adjunto.url)
      throw new NotFoundException('URL de archivo no disponible');
    res.redirect(adjunto.url);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id_ticket?: number | null },
  ) {
    if (!file) throw new BadRequestException('No se envió archivo');
    if (!file.buffer)
      throw new BadRequestException('El archivo no tiene contenido');

    configurarCloudinary();

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'incidencias', resource_type: 'auto' },
        (err, res) => (err ? reject(err) : resolve(res!)),
      );
      stream.end(file.buffer);
    });

    return this.service.create({
      id_ticket: body.id_ticket ?? undefined,
      nombre_original: file.originalname,
      extension: result.format,
      tamano: String(result.bytes),
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const adjunto = await this.service.findOne(+id);
    if (adjunto.public_id) {
      try {
        configurarCloudinary();
        await cloudinary.uploader.destroy(adjunto.public_id);
      } catch {
        // ignorar si falla la eliminación en Cloudinary
      }
    }
    return this.service.remove(+id);
  }
}