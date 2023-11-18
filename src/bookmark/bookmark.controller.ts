import {
	Post,
	Delete,
	Get,
	Patch,
	Injectable,
	Param,
	Body,
	ParseIntPipe,
} from '@nestjs/common';
import { createBookmarkDto as CreateBookmarkDto, EditBookmarkDto } from './dto';
import { GetUser } from 'src/auth/decorater';

@Injectable()
export class BookmarkService {
	@Post()
	createBookmark(
		@GetUser('id') userId: number,
		@Body()
		dto: CreateBookmarkDto,
	) {}

	@Get(':id')
	getBookmarks(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) bookmarkID: number,
	) {}

	@Get()
	getBookmarksID(@GetUser('id') userId: number) {}

	@Patch()
	editBookmarkByID(
		@GetUser('id') userId: number,
		@Body() dto: EditBookmarkDto,
	) {}

	@Delete(':id')
	deleteBookmark(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) bookmarkID: number,
	) {}
}
