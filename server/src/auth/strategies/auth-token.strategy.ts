import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/jwt.constant';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.authSecret,
    });
  }

  async validate(payload: any) {
    // console.log(payload);
    return payload;
  }
}
