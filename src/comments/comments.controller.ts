import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/decorators';
import { SuccessResponse } from 'src/utils/response.util';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const comment = await this.commentsService.addComment(
      createCommentDto,
      user.id,
    );
    return SuccessResponse(res, 201, 'Comment added successfully', {
      id: comment.id,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const comment = await this.commentsService.update(
      updateCommentDto,
      id,
      user.id,
    );
    return SuccessResponse(res, 200, 'Comment deleted successfully', {
      id: comment.id,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const comment = await this.commentsService.remove(id, user.id);
    return SuccessResponse(res, 200, 'Comment deleted successfully', {
      id: comment.id,
    });
  }
}
