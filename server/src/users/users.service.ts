import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CreateUserDto, GetUserDto } from './dto';
import { hashData } from 'src/common/other';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';

enum FieldEnum {
  id = 'id',
  username = 'username',
  email = 'email',
}

type Field = {
  [F in FieldEnum]?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async findOne(field: Field): Promise<GetUserDto | undefined> {
    let item = undefined;

    if (field.id) {
      item = await this.userRepository.findOne({
        where: { _id: new ObjectId(field.id) },
      });
    } else if (field.email) {
      item = await this.userRepository.findOne({
        where: { email: field.email },
      });
    } else if (field.username) {
      item = await this.userRepository.findOne({
        where: { username: field.username },
      });
    }

    if (!item) return undefined;

    return new GetUserDto(
      item._id.toHexString(),
      item.email,
      item.username,
      item.password,
    );
  }

  async create(createdUserDto: CreateUserDto): Promise<GetUserDto> {
    createdUserDto.password = hashData(createdUserDto.password);

    const item = await this.userRepository.save(createdUserDto);

    return new GetUserDto(
      item._id.toHexString(),
      item.email,
      item.username,
      item.password,
    );
  }
}
