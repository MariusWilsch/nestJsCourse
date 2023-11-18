import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BookmarkController } from '../bookmark/bookmark.service';

@Module({
  controllers: [UserController, BookmarkController],
  providers: [UserService]
})
export class UserModule {}
