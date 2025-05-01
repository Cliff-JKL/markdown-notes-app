import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants/jwt.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { MongoRepository } from 'typeorm';
import { CreateTokenDto } from './dto/create-token.dto';
import { cryptMatches, hashData } from 'src/common/other';
import { CreateUserDto, GetUserDto, LoginUserDto } from 'src/users/dto';
import { ObjectId } from 'mongodb';
import { GetTokenDto } from './dto';

interface tokenData {
  accessToken: string;
  refreshToken: string;
  atExpire: number;
  rtExpire: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private tokenRepository: MongoRepository<Token>,
  ) {}

  async generateTokens(user: GetUserDto): Promise<tokenData> {
    const payload = {
      uid: user.id,
      email: user.email,
      nickname: user.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.authSecret,
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      atExpire: 30 * 60 * 1000,
      rtExpire: 7 * 24 * 60 * 60 * 1000,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        userId: new ObjectId(userId),
      },
    });

    if (!token) {
      // console.log('token not found');
      const createdToken = new CreateTokenDto(userId, hashData(refreshToken));
      await this.tokenRepository.save({
        ...createdToken,
        userId: new ObjectId(userId),
      });
    } else {
      const item: GetTokenDto = {
        id: token._id.toHexString(),
        value: token.value,
      };

      // console.log(token);

      item.value = hashData(refreshToken);

      await this.tokenRepository.updateOne(
        { _id: new ObjectId(item.id) },
        { $set: { value: item.value } },
      );
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne({ id: userId });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const userTokens = await this.tokenRepository.find({
      where: { userId: new ObjectId(user.id) },
    });

    if (userTokens.length === 0) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = cryptMatches(refreshToken, userTokens[0].value);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signUp(userData: CreateUserDto) {
    const user = await this.usersService.create(userData);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(userDto: LoginUserDto) {
    const user = await this.usersService.findOne({ email: userDto.email });

    if (user && cryptMatches(userDto.password, user.password)) {
      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }

    throw new NotFoundException();
  }

  async logout(userId: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        userId: new ObjectId(userId),
      },
    });
    // TODO set refreshToken in DB (if its not null) to null
    if (!token) {
      return new ForbiddenException('Access Denied');
    }

    await this.tokenRepository.deleteOne({ _id: new ObjectId(token._id) });
  }
}
