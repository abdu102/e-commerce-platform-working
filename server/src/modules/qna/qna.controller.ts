import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { QnaService } from './qna.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { IsInt, IsString } from 'class-validator';

class CreateQuestionDto {
  @IsInt()
  productId!: number;
  @IsString()
  content!: string;
}

class CreateAnswerDto {
  @IsInt()
  questionId!: number;
  @IsString()
  content!: string;
}

@Controller('api/qna')
@UseGuards(RolesGuard)
@Roles('USER', 'ADMIN', 'SUPER_ADMIN')
export class QnaController {
  constructor(private service: QnaService) {}

  @Get(':productId')
  list(@Param('productId', ParseIntPipe) productId: number) {
    return this.service.list(productId);
  }

  @Post('question')
  createQuestion(@Req() req: any, @Body() dto: CreateQuestionDto) {
    return this.service.createQuestion(req.user.userId, dto);
  }

  @Post('answer')
  createAnswer(@Req() req: any, @Body() dto: CreateAnswerDto) {
    return this.service.createAnswer(req.user.userId, dto);
  }

  @Delete('question/:id')
  removeQuestion(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.removeQuestion(req.user.userId, id);
  }

  @Delete('answer/:id')
  removeAnswer(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.removeAnswer(req.user.userId, id);
  }
}


