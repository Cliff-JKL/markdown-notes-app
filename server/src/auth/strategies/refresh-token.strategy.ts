import { Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/jwt.constant';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  private static extractJWT(@Req() req: Request): string | null {
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(@Req() req, payload: any) {
    const refreshToken = req.cookies['refreshToken'];
    // console.log(refreshToken);
    // console.log(payload);

    return {
      ...payload,
      refreshToken,
    };
  }
}
