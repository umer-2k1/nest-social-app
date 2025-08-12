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
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/decorators';
import { Response } from 'express';
import { SuccessResponse } from 'src/utils/response.util';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createTweetDto: CreateTweetDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const tweet = await this.tweetsService.create(user, createTweetDto);
    return SuccessResponse(res, 201, 'Tweet created successfully', {
      id: tweet.id,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Res() res: Response) {
    const tweets = await this.tweetsService.findAll();
    return SuccessResponse(res, 200, 'Tweets fetched successfully', tweets);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const tweet = await this.tweetsService.findOne(id);
    return SuccessResponse(res, 200, 'Tweet fetched successfully', tweet);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @Delete('/del/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    await this.tweetsService.remove(id, user.id);
    return SuccessResponse(res, 200, 'Tweet deleted successfully');
  }

  @Get(':id/likes')
  @UseGuards(AuthGuard('jwt'))
  async getLikes(@Param('id') id: string, @Res() res: Response) {
    const likes = await this.tweetsService.getLikes(id);
    return SuccessResponse(res, 200, 'Likes fetched successfully', likes);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(
    @Param('id') id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { liked } = await this.tweetsService.toggleLike(id, user.id);
    return SuccessResponse(
      res,
      200,
      `Tweet ${liked ? 'liked' : 'unliked'} successfully`,
    );
  }
}
