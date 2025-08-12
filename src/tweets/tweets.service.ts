import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Injectable()
export class TweetsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createTweetDto: CreateTweetDto) {
    // return 'This action adds a new tweet';
    const { content, media, tags } = createTweetDto;
    const tweet = await this.prisma.tweet.create({
      data: {
        content,
        userId: user.id,
        tags: tags,
        media: {
          create: media?.map((m) => ({
            fileUrl: m.fileUrl,
            type: m.type,
          })),
        },
      },
    });
    return tweet;
  }

  async findAll() {
    const tweets = await this.prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        media: {
          select: {
            fileUrl: true,
            type: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tweets;
  }

  async findOne(id: string) {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        media: {
          select: {
            fileUrl: true,
            type: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        // _count: {
        //   likes: true,
        //   comments: true,
        // },
      },
    });

    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  async remove(id: string, userId: string) {
    const tweet = await this.prisma.tweet.delete({
      where: { id, userId },
    });
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet;
  }
  async getLikes(id: string) {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id },
      include: {
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet.likes;
  }

  async toggleLike(tweetId: string, userId: string) {
    const existingLike = await this.prisma.like.findFirst({
      where: { tweetId, userId },
    });
    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    }
    await this.prisma.like.create({
      data: {
        tweetId,
        userId,
      },
    });
    return { liked: true };
  }
}
