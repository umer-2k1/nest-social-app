import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async togglefollowUser(currentUserId: string, followingId: string) {
    const existing = await this.prisma.follows.findFirst({
      where: {
        followerId: currentUserId,
        followingId: followingId,
      },
    });

    if (existing) {
      // unfollow
      await this.prisma.follows.deleteMany({
        where: {
          followerId: currentUserId,
          followingId: followingId,
        },
      });
    } else {
      // follow
      await this.prisma.follows.create({
        data: {
          followerId: currentUserId,
          followingId: followingId,
        },
      });
    }
  }

  async followers(userId: string) {
    return await this.prisma.follows.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }
  async followings(userId: string) {
    return await this.prisma.follows.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });
  }

  findAll() {
    return `This action returns all follows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }
}
