import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

// import { SuccessResponse } from 'src/utils/response.util';
import { SuccessResponse } from 'src/utils/response.util';
import { GetUser } from './decorators';
import { User } from 'src/user/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Response } from 'express';
import { log } from 'console';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signup(@Body() dto: RegisterUserDto, @Res() res: Response) {
    const userId = await this.authService.registerUser(dto);
    return SuccessResponse(res, 201, 'User registered successfully', userId);
  }
  @Post('/sign-in')
  async signin(@Body() dto: LoginUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.loginUser(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // use secure cookies in production
      maxAge: 1 * 60 * 1000, // 15 minutes
      sameSite: 'lax',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    return SuccessResponse(res, 200, 'User logged in successfully');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getMe(@GetUser() user: User, @Res() res: Response) {
    return SuccessResponse(res, 200, 'User fetched successfully', user);
  }
}
