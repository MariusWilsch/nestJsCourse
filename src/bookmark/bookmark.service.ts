import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
	getBookmarks(userID: number) {}

	getBookmarksByID(userID: number, bookmarkID: number) {}

	createBookmark(userID: number, dto: CreateBookmarkDto) {}

	editBookmarkByID(userID: number, bookmarkID: number, dto: EditBookmarkDto) {}

	deleteBookmark(userID: number, bookmarkID: number) {}
}
