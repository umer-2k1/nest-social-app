import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { SuccessResponse } from 'src/utils/response.util';
import { GetUser } from './decorators';
import { User } from 'src/user/entities/user.entity';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const ACCESS_TOKEN_EXPIRES_IN_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

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
      maxAge: ACCESS_TOKEN_EXPIRES_IN_MS,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // use secure cookies in production
      maxAge: REFRESH_TOKEN_EXPIRES_IN_MS,
      sameSite: 'lax',
    });

    return SuccessResponse(res, 200, 'User logged in successfully');
  }

  @Post('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const userId = payload.sub;
    const accessToken = await this.authService.refreshUserToken(
      userId,
      refreshToken,
    );
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // use secure cookies in production
      maxAge: ACCESS_TOKEN_EXPIRES_IN_MS,
      sameSite: 'lax',
    });
    return SuccessResponse(res, 200, 'Token refreshed successfully');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  async logout(@GetUser() user: User, @Res() res: Response) {
    await this.authService.logoutUser(user.id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return SuccessResponse(res, 200, 'User logged out successfully');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getMe(@GetUser() user: User, @Res() res: Response) {
    return SuccessResponse(res, 200, 'User fetched successfully', user);
  }
}
