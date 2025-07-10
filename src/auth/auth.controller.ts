import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { Response } from 'express';
// import { SuccessResponse } from 'src/utils/response.util';
import { SuccessResponse } from 'src/utils/response.util';
import { GetUser } from './decorators';
import { User } from 'src/user/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signup(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }
  @Post('/sign-in')
  async signin(@Body() dto: LoginUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.loginUser(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // use secure cookies in production
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'lax',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });
    return res
      .status(200)
      .json(
        SuccessResponse(200, 'User logged in successfully', { foo: 'bar' }),
      );
  }

  @UseGuards(JwtStrategy)
  @Get('/me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
