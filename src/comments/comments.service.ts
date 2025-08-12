import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async addComment(createCommentDto: CreateCommentDto, userId: string) {
    const { content, tweetId } = createCommentDto;
    return await this.prisma.comment.create({
      data: {
        tweetId,
        userId,
        content,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });
  }

  async update(updateCommentDto: UpdateCommentDto, id: string, userId: string) {
    const comment = await this.prisma.comment.update({
      where: { id, userId },
      data: { content: updateCommentDto.content },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.delete({ where: { id, userId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }
}
