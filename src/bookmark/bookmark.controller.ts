import {
	Post,
	Delete,
	Get,
	Patch,
	Param,
	Body,
	ParseIntPipe,
	UseGuards,
	Controller,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { GetUser } from 'src/auth/decorater';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
	constructor(private bookmarkService: BookmarkService) {}
	@Post()
	createBookmark(
		@GetUser('id') userID: number,
		@Body()
		dto: CreateBookmarkDto,
	) {
		return this.bookmarkService.createBookmark(userID, dto);
	}

	@Get()
	getBookmarks(@GetUser('id') userID: number) {
		return this.bookmarkService.getBookmarks(userID);
	}

	@Get(':id')
	getBookmarksByID(
		@GetUser('id') userID: number,
		@Param('id', ParseIntPipe) bookmarkID: number,
	) {
		return this.bookmarkService.getBookmarksByID(userID, bookmarkID);
	}

	@Patch(':id')
	editBookmarkByID(
		@GetUser('id') userID: number,
		@Param('id', ParseIntPipe) bookmarkID: number,
		@Body() dto: EditBookmarkDto,
	) {
		return this.bookmarkService.editBookmarkByID(userID, bookmarkID, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteBookmark(
		@GetUser('id') userID: number,
		@Param('id', ParseIntPipe) bookmarkID: number,
	) {
		return this.bookmarkService.deleteBookmark(userID, bookmarkID);
	}
}
