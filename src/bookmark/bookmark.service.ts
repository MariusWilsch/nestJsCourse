import { ForbiddenException, Injectable } from '@nestjs/common';
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

	getBookmarksByID(userID: number, bookmarkID: number) {
		return this.prismaService.bookmark.findUnique({
			where: {
				id: bookmarkID,
				userID,
			},
		});
	}

	async createBookmark(userID: number, dto: CreateBookmarkDto) {
		const bookmark = await this.prismaService.bookmark.create({
			data: {
				userID,
				...dto,
			},
		});

		return bookmark;
	}

	async editBookmarkByID(
		userID: number,
		bookmarkID: number,
		dto: EditBookmarkDto,
	) {
		await this.verifyBookmarkOwnership(userID, bookmarkID);
		return this.prismaService.bookmark.update({
			where: { id: bookmarkID },
			data: { ...dto },
		});
	}

	async deleteBookmark(userID: number, bookmarkID: number) {
		await this.verifyBookmarkOwnership(userID, bookmarkID);
		return this.prismaService.bookmark.delete({ where: { id: bookmarkID } });
	}

	/* Helper functions */
	async verifyBookmarkOwnership(userID: number, bookmarkID: number) {
		// get bookmark
		const bookmark = await this.prismaService.bookmark.findUnique({
			where: {
				id: bookmarkID,
			},
		});
		// check if user owns bookmark
		if (!bookmark || bookmark.userID !== userID)
			throw new ForbiddenException('Access to resource denied');
	}
}
