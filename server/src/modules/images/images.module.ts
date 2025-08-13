import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [PrismaModule],
  providers: [ImagesService],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}


