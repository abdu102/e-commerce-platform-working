import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QnaController } from './qna.controller';
import { QnaService } from './qna.service';

@Module({
  imports: [PrismaModule],
  controllers: [QnaController],
  providers: [QnaService],
})
export class QnaModule {}


