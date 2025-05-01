import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/entities/tag.entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TagsController } from './tags/tags.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { Token } from './auth/entities/token.entity';
import { User } from './users/entities/user.entity';
import { Note } from './notes/entities/note.entity';
import { UsersController } from './users/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotesModule } from './notes/notes.module';
import { NotesController } from './notes/notes.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: '0.0.0.0',
      port: 27018,
      database: process.env.DATABASE_DBNAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      synchronize: true,
      entities: [Tag, Token, User, Note],
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
      // migrations:
    }),
    TagsModule,
    AuthModule,
    UsersModule,
    NotesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude({ path: 'auth/(.*)', method: RequestMethod.ALL })
      .forRoutes(
        TagsController,
        AuthController,
        UsersController,
        NotesController,
      );
  }
}
