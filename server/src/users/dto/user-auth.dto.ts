import { IsArray } from 'class-validator';
import { GetUserDto } from './get-user.dto';
import { Token } from 'src/auth/entities/token.entity';

export class UserAuthDto extends GetUserDto {
  @IsArray()
  tokens: Token[];

  constructor(
    id: string,
    email: string,
    username: string,
    password: string,
    tokens: Token[],
  ) {
    super(id, email, username, password);
    this.tokens = tokens;
  }
}
