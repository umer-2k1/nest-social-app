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

@Controller('follows')
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

  @Get()
  findAll() {
    return this.followsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followsService.update(+id, updateFollowDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.followsService.remove(+id);
  }
}
