import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';

@Controller('api/v2/images')
export class ImagesController {
  constructor(private readonly images: ImagesService) {}

  @Get(':name')
  async get(@Param('name') name: string, @Res() res: Response) {
    const img = await this.images.getByName(name);
    if (img.contentType) res.setHeader('Content-Type', img.contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(Buffer.from(img.data as any));
  }

  // Simple upload endpoint: body should be JSON with base64 data
  @Post()
  async upload(@Body() body: { name: string; contentType?: string; base64: string }) {
    const buffer = Buffer.from((body.base64 || '').split(',').pop() || '', 'base64');
    const saved = await this.images.upsert(body.name, body.contentType, buffer);
    return { id: saved.id, name: saved.name };
  }
}


