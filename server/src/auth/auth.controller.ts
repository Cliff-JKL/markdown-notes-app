import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from 'src/users/dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SendTokenDto } from './dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Public()
  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<SendTokenDto> {
    const tokenData = await this.authService.signUp(createUserDto);
    // TODO secure: true in options for https
    res.cookie('refreshToken', tokenData.refreshToken, {
      maxAge: tokenData.rtExpire,
      path: '/api/auth',
      httpOnly: true,
      // secure: true,
    });

    return new SendTokenDto(tokenData.accessToken, tokenData.atExpire);
  }

  @Public()
  @Post('signin')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<SendTokenDto> {
    const tokenData = await this.authService.signIn(loginUserDto);
    res.cookie('refreshToken', tokenData.refreshToken, {
      maxAge: tokenData.rtExpire,
      // path: '/api/auth',
      // httpOnly: true,
      // sameSite: 'none',
      // secure: true,
    });

    return new SendTokenDto(tokenData.accessToken, tokenData.atExpire);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: any, // TODO: create interface
    @Res({ passthrough: true }) res: Response,
  ): Promise<SendTokenDto> {
    const refreshTokenData = await this.authService.refreshTokens(
      user.uid,
      user.refreshToken,
    );

    res.cookie('refreshToken', refreshTokenData.refreshToken, {
      maxAge: refreshTokenData.rtExpire,
      // path: '/api/auth',
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });

    return new SendTokenDto(
      refreshTokenData.accessToken,
      refreshTokenData.atExpire,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    req.logout(() => {
      this.authService.logout(user.uid);
      res.cookie('refreshToken', '', {
        expires: new Date(),
        domain: 'localhost',
      });
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
