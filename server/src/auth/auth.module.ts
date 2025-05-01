import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokenStrategy } from './strategies/auth-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    UsersModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, AuthTokenStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
