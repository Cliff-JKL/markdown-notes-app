import { IsString, IsEmail, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(10, { message: 'The password must be at least 10 characters' })
  @Matches(/\d+/, {
    message: 'The password must contains at least one number character',
  })
  @Matches(/[A-Za-z]+/, {
    message: 'The password must contains at least one letter character',
  })
  password: string;
}
