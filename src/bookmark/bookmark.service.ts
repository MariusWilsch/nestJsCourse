import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
	constructor(private prismaService: PrismaService) {}
	getBookmarks(userID: number) {
		return this.prismaService.bookmark.findMany({
			where: { userID },
		});
	}

	getBookmarksByID(userID: number, bookmarkID: number) {}

	createBookmark(userID: number, dto: CreateBookmarkDto) {}

	editBookmarkByID(userID: number, bookmarkID: number, dto: EditBookmarkDto) {}

	deleteBookmark(userID: number, bookmarkID: number) {}
}
