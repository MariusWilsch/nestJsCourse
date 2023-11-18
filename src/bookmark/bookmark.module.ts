import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.controller';

@Module({
	providers: [BookmarkService],
})
export class BookmarkModule {}
