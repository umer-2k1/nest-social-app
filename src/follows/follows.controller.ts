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
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { SuccessResponse } from 'src/utils/response.util';
import { Response } from 'express';
import { FollowsService } from './follows.service';

@Controller()
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('follows/:userId')
  async togglefollow(
    @GetUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.followsService.togglefollowUser(user.id, id);
    return SuccessResponse(res, 200, 'User fetched successfully');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/followers')
  async followers(@GetUser() user: User, @Res() res: Response) {
    await this.followsService.followers(user.id);
    return SuccessResponse(res, 200, 'User followers fetched successfully');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/followers')
  async followings(@GetUser() user: User, @Res() res: Response) {
    await this.followsService.followings(user.id);
    return SuccessResponse(res, 200, 'User following fetched successfully');
  }
}
